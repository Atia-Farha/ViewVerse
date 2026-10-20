const DEFAULT_BASE = 'https://image.tmdb.org/t/p';

export function getTmdbImageBase() {
	const config = useRuntimeConfig();
	return config.public.tmdbImageBase || DEFAULT_BASE;
}

/**
 * Intrinsic TMDB image dimensions by size bucket.
 *
 * TMDB returns images at a fixed width. The height varies by source type
 * (poster 2:3, backdrop 16:9, profile 1:1), and the URL uses the same size
 * string for both — `w780` could be either a poster or a backdrop. Callers
 * pass the source type to `tmdbSizeDims` to pick the right ratio.
 */
const POSTER_DIMS = {
	w185: { w: 185, h: 278 },
	w342: { w: 342, h: 513 },
	w500: { w: 500, h: 750 },
	w780: { w: 780, h: 1170 },
};

const BACKDROP_DIMS = {
	w300: { w: 300, h: 169 },
	w780: { w: 780, h: 439 },
	w1280: { w: 1280, h: 720 },
	original: { w: 2000, h: 1125 },
};

const PROFILE_DIMS = {
	w185: { w: 185, h: 185 },
	h632: { w: 632, h: 632 },
};

const STILL_DIMS = {
	w185: { w: 185, h: 104 },
	w300: { w: 300, h: 169 },
};

export function tmdbSizeDims(size, kind = 'poster') {
	const table = kind === 'backdrop' ? BACKDROP_DIMS : kind === 'profile' ? PROFILE_DIMS : kind === 'still' ? STILL_DIMS : POSTER_DIMS;
	return table[size] || null;
}

export function tmdbImage(path, size = 'w500') {
	if (!path || typeof path !== 'string') return null;
	if (!path.startsWith('/')) return null;
	return `${getTmdbImageBase().replace(/\/+$/, '')}/${size}${path}`;
}

/**
 * Absolute TMDB image URL suitable for og:image / twitter:image.
 * Returns `null` if the path is empty so callers can short-circuit.
 */
export function tmdbShareImage(path, size = 'original') {
	const url = tmdbImage(path, size);
	return url || null;
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
