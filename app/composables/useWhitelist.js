import { computed } from 'vue';

const STORAGE_KEY = 'viewverse:whitelist:v1';
const MAX_ITEMS = 500;

function isBrowser() {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function readFromStorage() {
	if (!isBrowser()) return [];
	let raw;
	try {
		raw = localStorage.getItem(STORAGE_KEY);
	} catch {
		return [];
	}
	if (!raw) return [];

	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return [];
	}

	if (!Array.isArray(parsed)) return [];

	const valid = [];
	for (const item of parsed) {
		if (!item || typeof item !== 'object') continue;
		if (item.media_type !== 'movie' && item.media_type !== 'tv') continue;
		if (typeof item.id !== 'number') continue;
		if (typeof item.title !== 'string' || item.title.length === 0) continue;
		valid.push({
			id: item.id,
			media_type: item.media_type,
			title: item.title,
			poster_path: typeof item.poster_path === 'string' ? item.poster_path : null,
			added_at: typeof item.added_at === 'number' ? item.added_at : Date.now(),
		});
	}
	return valid;
}

function writeToStorage(items) {
	if (!isBrowser()) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {}
}

function keyFor(item) {
	return `${item.media_type}:${item.id}`;
}

export function useWhitelist() {
	const items = useState('whitelist:items', () => (isBrowser() ? readFromStorage() : []));

	function hydrate() {
		if (!isBrowser()) return;
		items.value = readFromStorage();
	}

	const count = computed(() => items.value.length);
	const movies = computed(() => items.value.filter((i) => i.media_type === 'movie'));
	const tvShows = computed(() => items.value.filter((i) => i.media_type === 'tv'));

	function isInList(id, mediaType) {
		const target = keyFor({ id, media_type: mediaType });
		return items.value.some((item) => keyFor(item) === target);
	}

	function add(entry) {
		if (!entry || typeof entry.id !== 'number') return false;
		if (entry.media_type !== 'movie' && entry.media_type !== 'tv') return false;
		const target = keyFor({ id: entry.id, media_type: entry.media_type });
		const existing = items.value.findIndex((i) => keyFor(i) === target);
		if (existing >= 0) return false;

		const next = [
			{
				id: entry.id,
				media_type: entry.media_type,
				title: entry.title || 'Untitled',
				poster_path: entry.poster_path ?? null,
				added_at: Date.now(),
			},
			...items.value,
		];
		if (next.length > MAX_ITEMS) next.length = MAX_ITEMS;
		items.value = next;
		writeToStorage(next);
		return true;
	}

	function remove(id, mediaType) {
		const target = keyFor({ id, media_type: mediaType });
		const next = items.value.filter((i) => keyFor(i) !== target);
		if (next.length === items.value.length) return false;
		items.value = next;
		writeToStorage(next);
		return true;
	}

	function toggle(entry) {
		if (isInList(entry.id, entry.media_type)) {
			remove(entry.id, entry.media_type);
			return false;
		}
		add(entry);
		return true;
	}

	function clear() {
		items.value = [];
		writeToStorage([]);
	}

	if (isBrowser()) {
		const onStorage = (event) => {
			if (event.key !== STORAGE_KEY) return;
			items.value = readFromStorage();
		};
		window.addEventListener('storage', onStorage);
		if (typeof onScopeDispose === 'function') {
			onScopeDispose(() => window.removeEventListener('storage', onStorage));
		}
	}

	return {
		items,
		count,
		movies,
		tvShows,
		isInList,
		add,
		remove,
		toggle,
		clear,
		hydrate,
	};
}
