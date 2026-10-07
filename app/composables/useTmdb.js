const CACHE_TTL_MS = 5 * 60 * 1000;
const inFlight = new Map();
const cache = new Map();

function getToken() {
	const config = useRuntimeConfig();
	return config.public.tmdbToken || '';
}

function getApiBase() {
	const config = useRuntimeConfig();
	return config.public.tmdbApiBase || 'https://api.themoviedb.org/3';
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

async function tmdbFetch(path, params, options = {}) {
	const { skipCache = false, skipDedupe = false } = options;
	const key = cacheKey(path, params);

	if (!skipCache) {
		const cached = cache.get(key);
		if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
			return cached.data;
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
			if (!skipCache) cache.set(key, { ts: Date.now(), data });
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
