const CACHE_TTL_MS = 5 * 60 * 1000;
const STALE_TTL_MS = 60 * 60 * 1000;
const MAX_ENTRIES = 500;

const inFlight = new Map();
const cache = new Map();

let cachedConfig = null;

function readPublicConfig(key) {
	const fromEnv = import.meta.env?.[`NUXT_PUBLIC_${key.toUpperCase()}`];
	if (fromEnv) return String(fromEnv);

	if (cachedConfig?.[key]) return String(cachedConfig[key]);

	try {
		const nuxtApp = useNuxtApp();
		if (nuxtApp?.$config?.public?.[key]) {
			cachedConfig = nuxtApp.$config.public;
			return String(cachedConfig[key]);
		}
	} catch {}

	try {
		const config = useRuntimeConfig();
		if (config?.public?.[key]) {
			cachedConfig = config.public;
			return String(cachedConfig[key]);
		}
	} catch {}

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

function evictIfNeeded() {
	while (cache.size > MAX_ENTRIES) {
		const oldest = cache.keys().next().value;
		if (oldest === undefined) break;
		cache.delete(oldest);
	}
}

function touch(key, entry) {
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
				touch(key, entry);

				if (!skipDedupe && !inFlight.has(key)) {
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
	if (!cachedConfig) {
		try {
			cachedConfig = useRuntimeConfig().public;
		} catch {}
	}

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
		genresMovie: () => tmdbFetch('/genre/movie/list'),
		genresTv: () => tmdbFetch('/genre/tv/list'),

		fetchRaw: (path, params, options) => tmdbFetch(path, params, options),
	};
}
