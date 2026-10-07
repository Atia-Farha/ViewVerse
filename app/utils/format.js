export function getYear(date) {
	if (!date || typeof date !== 'string') return null;
	const year = date.slice(0, 4);
	return /^\d{4}$/.test(year) ? year : null;
}

export function formatRuntime(minutes) {
	if (!minutes || typeof minutes !== 'number' || minutes <= 0) return null;
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (h <= 0) return `${m}m`;
	if (m === 0) return `${h}h`;
	return `${h}h ${m}m`;
}

export function formatRating(value) {
	if (typeof value !== 'number' || Number.isNaN(value)) return null;
	return value.toFixed(1);
}

export function formatDate(date) {
	if (!date || typeof date !== 'string') return null;
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return null;
	return parsed.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export function truncate(text, max = 200) {
	if (!text || typeof text !== 'string') return '';
	if (text.length <= max) return text;
	const slice = text.slice(0, max);
	const lastSpace = slice.lastIndexOf(' ');
	return `${(lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

export function formatVoteCount(count) {
	if (typeof count !== 'number' || count <= 0) return null;
	if (count < 1000) return String(count);
	if (count < 1_000_000) return `${(count / 1000).toFixed(count < 10_000 ? 1 : 0)}k`;
	return `${(count / 1_000_000).toFixed(1)}M`;
}
