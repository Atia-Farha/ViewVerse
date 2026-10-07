const DEFAULT_BASE = 'https://image.tmdb.org/t/p';

export function getTmdbImageBase() {
	const config = useRuntimeConfig();
	return config.public.tmdbImageBase || DEFAULT_BASE;
}

export function tmdbImage(path, size = 'w500') {
	if (!path || typeof path !== 'string') return null;
	if (!path.startsWith('/')) return null;
	return `${getTmdbImageBase()}/${size}${path}`;
}

export function posterThumb(path) {
	return tmdbImage(path, 'w185');
}

export function posterMedium(path) {
	return tmdbImage(path, 'w342');
}

export function posterLarge(path) {
	return tmdbImage(path, 'w500');
}

export function backdropSmall(path) {
	return tmdbImage(path, 'w300');
}

export function backdropMedium(path) {
	return tmdbImage(path, 'w780');
}

export function backdropLarge(path) {
	return tmdbImage(path, 'w1280');
}

export function backdropOriginal(path) {
	return tmdbImage(path, 'original');
}

export function profileImage(path, size = 'w185') {
	return tmdbImage(path, size);
}

export function stillImage(path, size = 'w300') {
	return tmdbImage(path, size);
}
