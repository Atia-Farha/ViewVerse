const DEFAULT_BASE = 'https://image.tmdb.org/t/p';

let cachedImageBase = null;

export function getTmdbImageBase() {
	if (cachedImageBase) return cachedImageBase;
	try {
		const nuxtApp = useNuxtApp();
		if (nuxtApp?.$config?.public?.tmdbImageBase) {
			cachedImageBase = nuxtApp.$config.public.tmdbImageBase;
			return cachedImageBase;
		}
	} catch {}
	try {
		const config = useRuntimeConfig();
		if (config?.public?.tmdbImageBase) {
			cachedImageBase = config.public.tmdbImageBase;
			return cachedImageBase;
		}
	} catch {}
	return DEFAULT_BASE;
}

export function tmdbImage(path, size = 'w500') {
	if (!path || typeof path !== 'string') return null;
	if (!path.startsWith('/')) return null;
	return `${getTmdbImageBase().replace(/\/+$/, '')}/${size}${path}`;
}

export function tmdbShareImage(path, size = 'original') {
	const url = tmdbImage(path, size);
	return url || null;
}

export function posterThumb(path) {
	return tmdbImage(path, 'w185');
}

export function posterLarge(path) {
	return tmdbImage(path, 'w500');
}

export function backdropLarge(path) {
	return tmdbImage(path, 'w1280');
}

export function profileImage(path, size = 'w185') {
	return tmdbImage(path, size);
}

export function stillImage(path, size = 'w300') {
	return tmdbImage(path, size);
}
