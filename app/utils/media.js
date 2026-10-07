function pickTitle(item) {
	if (!item) return '';
	if (item.media_type === 'person') return item.name || '';

	return item.title || item.name || item.original_title || item.original_name || '';
}

function pickDate(item) {
	if (!item) return null;
	if (item.media_type === 'person') return null;
	if (item.media_type === 'tv' || item.first_air_date !== undefined) {
		return item.first_air_date || null;
	}
	return item.release_date || null;
}

function pickMediaType(item) {
	if (!item) return null;
	if (item.media_type === 'person') return 'person';
	if (item.media_type === 'tv' || item.first_air_date !== undefined) return 'tv';
	return 'movie';
}

export function normalizeMedia(item) {
	if (!item || typeof item.id !== 'number') return null;
	const mediaType = pickMediaType(item);
	const date = pickDate(item);
	const knownFor = Array.isArray(item.known_for)
		? item.known_for
				.map((entry) => entry?.title || entry?.name || entry?.original_title || entry?.original_name || '')
				.filter(Boolean)
				.slice(0, 3)
				.join(', ')
		: null;
	return {
		id: item.id,
		media_type: mediaType,
		title: pickTitle(item),
		poster_path: item.poster_path ?? item.profile_path ?? null,
		backdrop_path: item.backdrop_path ?? null,
		year: typeof date === 'string' ? date.slice(0, 4) : null,
		rating: typeof item.vote_average === 'number' ? item.vote_average : null,
		vote_count: typeof item.vote_count === 'number' ? item.vote_count : null,
		overview: item.overview || null,
		known_for: knownFor,

		character: typeof item.character === 'string' && item.character ? item.character : null,
		job: typeof item.job === 'string' && item.job ? item.job : null,
		episode_count: typeof item.episode_count === 'number' ? item.episode_count : null,
	};
}

export function normalizeList(list) {
	if (!Array.isArray(list)) return [];
	const out = [];
	for (const item of list) {
		const norm = normalizeMedia(item);
		if (norm) out.push(norm);
	}
	return out;
}
