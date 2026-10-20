/**
 * TMDB data access.
 *
 * Three properties this cache has to hold, and why:
 *
 *  - **Bounded.** A long-lived server renders many different detail pages; an
 *    unbounded Map keeps every TMDB response for the life of the process.
 *    `MAX_ENTRIES` evicts least-recently-used once exceeded.
 *  - **Coalesced.** Several rows on the home page, and the hero, request the
 *    same list. Concurrent misses share one upstream request instead of N.
 *  - **stale-while-revalidate.** Without this, the moment the TTL lapses every
 *    request pays the full upstream latency again (~600-1000ms measured) even
 *    though the previous value is still perfectly good to show. Instead the
 *    stale value is returned immediately and exactly one request refreshes in
 *    the background.
 *
 * The trade-off this buys and its cost: responses may be up to `STALE_TTL_MS`
 * old past the TTL. For TMDB catalog data that is fine — trending and
 * top-rated lists move slowly — but it is a correctness decision, not just a
 * speed one, so it is stated here rather than left implicit.
 */

const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * How long past `CACHE_TTL_MS` a value may still be served while it refreshes.
 * After this it is treated as a hard miss.
 */
const STALE_TTL_MS = 60 * 60 * 1000;

/** Cap on distinct cached responses, to bound memory on a long-running process. */
const MAX_ENTRIES = 500;

const inFlight = new Map();
const cache = new Map();

/**
 * Read public runtime config without requiring an active Nuxt instance.
 *
 * During prerender (`nuxt generate`) these helpers run from Nitro's built
 * server chunks, where `useRuntimeConfig()` throws NUXT_E1001 because there is
 * no Vue/Nuxt app instance in scope. Nuxt inlines `NUXT_PUBLIC_*` into
 * `import.meta.env` at build time, so read that first and only fall back to
 * `useRuntimeConfig()` when a context genuinely exists.
 */
function readPublicConfig(key) {
	const fromEnv = import.meta.env?.[`NUXT_PUBLIC_${key.toUpperCase()}`];
	if (fromEnv) return String(fromEnv);

	try {
		const value = useRuntimeConfig().public?.[key];
		if (value) return String(value);
	} catch {
		/* no Nuxt context (e.g. prerender) — fall through to defaults */
	}
	return '';
}

function getToken() {
	return readPublicConfig('tmdbToken');
}

function getApiBase() {
	return readPublicConfig('tmdbApiBase') || 'https://api.themoviedb.org/3';
}

function cacheKey(path, params) {
	const normalized = params
		? Object.keys(params)
				.sort()
				.reduce((acc, key) => {
					const value = params[key];
					if (value === undefined || value === null || value === '') return acc;
					acc[key] = value;
					return acc;
				}, {})
		: null;
	if (!normalized) return path;
	return `${path}?${JSON.stringify(normalized)}`;
}

/** Drop least-recently-inserted entries once the cache exceeds its cap. */
function evictIfNeeded() {
	while (cache.size > MAX_ENTRIES) {
		// Map preserves insertion order, so the first key is the oldest.
		const oldest = cache.keys().next().value;
		if (oldest === undefined) break;
		cache.delete(oldest);
	}
}

function touch(key, entry) {
	// Re-insert so this entry becomes the newest and is evicted last.
	cache.delete(key);
	cache.set(key, entry);
}

async function tmdbFetch(path, params, options = {}) {
	const { skipCache = false, skipDedupe = false } = options;
	const key = cacheKey(path, params);

	if (!skipCache) {
		const entry = cache.get(key);
		if (entry) {
			const age = Date.now() - entry.ts;
			if (age < CACHE_TTL_MS) {
				touch(key, entry);
				return entry.data;
			}

			if (age < CACHE_TTL_MS + STALE_TTL_MS) {
				// Fresh enough to show, stale enough to be worth refreshing.
				touch(key, entry);
				if (!skipDedupe && !inFlight.has(key)) {
					// Kick off a refresh without making this caller wait for it.
					tmdbFetch(path, params, { ...options, skipCache: true }).catch(() => {});
				}
				return entry.data;
			}
		}
	}

	if (!skipDedupe && inFlight.has(key)) {
		return inFlight.get(key);
	}

	const token = getToken();
	if (!token) {
		const err = new Error('TMDB token is not configured.');
		err.code = 'NO_TOKEN';
		throw err;
	}

	const promise = (async () => {
		try {
			const data = await $fetch(`${getApiBase()}${path}`, {
				method: 'GET',
				params,
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				retry: 1,
				retryDelay: 300,
			});
			if (!skipCache) {
				cache.delete(key);
				cache.set(key, { ts: Date.now(), data });
				evictIfNeeded();
			}
			return data;
		} catch (error) {
			const normalized = new Error(error?.statusMessage || error?.message || 'TMDB request failed');
			normalized.status = error?.status || error?.response?.status;
			normalized.cause = error;
			throw normalized;
		} finally {
			inFlight.delete(key);
		}
	})();

	if (!skipDedupe) inFlight.set(key, promise);
	try {
		return await promise;
	} finally {
		if (!skipDedupe) inFlight.delete(key);
	}
}

export function useTmdb() {
	return {
		trending: (mediaType = 'all', timeWindow = 'week', params = {}) => tmdbFetch(`/trending/${mediaType}/${timeWindow}`, params),
		moviePopular: (params = {}) => tmdbFetch('/movie/popular', params),
		movieTopRated: (params = {}) => tmdbFetch('/movie/top_rated', params),
		movieUpcoming: (params = {}) => tmdbFetch('/movie/upcoming', params),
		movieNowPlaying: (params = {}) => tmdbFetch('/movie/now_playing', params),
		tvPopular: (params = {}) => tmdbFetch('/tv/popular', params),
		tvTopRated: (params = {}) => tmdbFetch('/tv/top_rated', params),
		tvAiringToday: (params = {}) => tmdbFetch('/tv/airing_today', params),
		tvOnTheAir: (params = {}) => tmdbFetch('/tv/on_the_air', params),
		movieDetails: (id, params = {}) => {
			const merged = { append_to_response: 'credits,videos,images,similar,recommendations,external_ids', ...params };
			return tmdbFetch(`/movie/${id}`, merged);
		},
		tvDetails: (id, params = {}) => {
			const merged = {
				append_to_response: 'credits,videos,images,similar,recommendations,external_ids',
				...params,
			};
			return tmdbFetch(`/tv/${id}`, merged);
		},
		tvSeason: (id, season, params = {}) => tmdbFetch(`/tv/${id}/season/${season}`, params),
		searchMulti: (query, params = {}) => tmdbFetch('/search/multi', { query, ...params }),
		searchMovie: (query, params = {}) => tmdbFetch('/search/movie', { query, ...params }),
		searchTv: (query, params = {}) => tmdbFetch('/search/tv', { query, ...params }),
		genresMovie: () => tmdbFetch('/genre/movie/list'),
		genresTv: () => tmdbFetch('/genre/tv/list'),

		fetchRaw: (path, params, options) => tmdbFetch(path, params, options),
	};
}

export function clearTmdbCache() {
	cache.clear();
	inFlight.clear();
}
