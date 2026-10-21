const SCREENSCAPE_BASE = 'https://nxsha.screenscape.me';

export const SCREENSCAPE_ORIGIN = 'https://nxsha.screenscape.me';

export function buildScreenscapeMovieUrl(tmdbId, options = {}) {
	const params = new URLSearchParams();
	params.set('tmdb', String(tmdbId));
	params.set('type', 'movie');
	if (options.lan) params.set('lan', options.lan);

	return `${SCREENSCAPE_BASE}/embed?${params.toString()}`;
}

export function buildScreenscapeTvUrl(tmdbId, season, episode, options = {}) {
	const params = new URLSearchParams();
	params.set('tmdb', String(tmdbId));
	params.set('type', 'tv');
	params.set('s', String(season));
	params.set('e', String(episode));
	if (options.lan) params.set('lan', options.lan);

	return `${SCREENSCAPE_BASE}/embed?${params.toString()}`;
}
