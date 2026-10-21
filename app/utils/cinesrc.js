const CINESRC_BASE = 'https://cinesrc.st';

export const CINESRC_ORIGIN = 'https://cinesrc.st';

export function buildCinesrcMovieUrl(tmdbId, options = {}) {
	const params = new URLSearchParams();
	if (typeof options.autoplay === 'boolean') params.set('autoplay', String(options.autoplay));
	if (typeof options.muted === 'boolean') params.set('muted', String(options.muted));
	if (typeof options.controls === 'boolean') params.set('controls', String(options.controls));
	if (typeof options.autonext === 'boolean') params.set('autonext', String(options.autonext));
	if (typeof options.autoskip === 'boolean') params.set('autoskip', String(options.autoskip));
	if (options.color) params.set('color', options.color);
	if (typeof options.seek === 'number') params.set('seek', String(options.seek));
	if (options.quality) params.set('quality', options.quality);
	if (typeof options.t === 'number') params.set('t', String(options.t));

	const qs = params.toString();
	return qs ? `${CINESRC_BASE}/embed/movie/${tmdbId}?${qs}` : `${CINESRC_BASE}/embed/movie/${tmdbId}`;
}

export function buildCinesrcTvUrl(tmdbId, season, episode, options = {}) {
	const params = new URLSearchParams();
	params.set('s', String(season));
	params.set('e', String(episode));
	if (typeof options.autoplay === 'boolean') params.set('autoplay', String(options.autoplay));
	if (typeof options.muted === 'boolean') params.set('muted', String(options.muted));
	if (typeof options.controls === 'boolean') params.set('controls', String(options.controls));
	if (typeof options.autonext === 'boolean') params.set('autonext', String(options.autonext));
	if (typeof options.autoskip === 'boolean') params.set('autoskip', String(options.autoskip));
	if (options.color) params.set('color', options.color);
	if (typeof options.seek === 'number') params.set('seek', String(options.seek));
	if (options.quality) params.set('quality', options.quality);
	if (typeof options.t === 'number') params.set('t', String(options.t));

	const qs = params.toString();
	return `${CINESRC_BASE}/embed/tv/${tmdbId}?${qs}`;
}
