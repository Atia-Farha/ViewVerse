const VIDFAST_BASE = 'https://vidfast.vc';

export const VIDFAST_ORIGINS = ['https://vidfast.pro', 'https://vidfast.in', 'https://vidfast.io', 'https://vidfast.me', 'https://vidfast.net', 'https://vidfast.pm', 'https://vidfast.xyz', 'https://vidfast.vc', 'https://vidfast.bz'];

export function buildVidfastMovieUrl(tmdbId, options = {}) {
	const params = new URLSearchParams();
	if (options.autoPlay) params.set('autoPlay', 'true');
	if (options.theme) params.set('theme', options.theme);
	if (options.sub) params.set('sub', options.sub);
	if (options.server) params.set('server', options.server);
	if (typeof options.poster === 'boolean') params.set('poster', String(options.poster));
	if (typeof options.title === 'boolean') params.set('title', String(options.title));
	if (typeof options.hideServer === 'boolean') params.set('hideServer', String(options.hideServer));
	if (typeof options.fullscreenButton === 'boolean') params.set('fullscreenButton', String(options.fullscreenButton));
	if (typeof options.chromecast === 'boolean') params.set('chromecast', String(options.chromecast));

	const qs = params.toString();
	return qs ? `${VIDFAST_BASE}/movie/${tmdbId}?${qs}` : `${VIDFAST_BASE}/movie/${tmdbId}`;
}

export function buildVidfastTvUrl(tmdbId, season, episode, options = {}) {
	const params = new URLSearchParams();
	if (options.autoPlay) params.set('autoPlay', 'true');
	if (options.theme) params.set('theme', options.theme);
	if (options.sub) params.set('sub', options.sub);
	if (options.server) params.set('server', options.server);
	if (typeof options.poster === 'boolean') params.set('poster', String(options.poster));
	if (typeof options.title === 'boolean') params.set('title', String(options.title));
	if (typeof options.hideServer === 'boolean') params.set('hideServer', String(options.hideServer));
	if (typeof options.fullscreenButton === 'boolean') params.set('fullscreenButton', String(options.fullscreenButton));
	if (typeof options.chromecast === 'boolean') params.set('chromecast', String(options.chromecast));
	if (options.nextButton) params.set('nextButton', 'true');
	if (options.autoNext) {
		params.set('nextButton', 'true');
		params.set('autoNext', 'true');
	}

	const qs = params.toString();
	return qs ? `${VIDFAST_BASE}/tv/${tmdbId}/${season}/${episode}?${qs}` : `${VIDFAST_BASE}/tv/${tmdbId}/${season}/${episode}`;
}
