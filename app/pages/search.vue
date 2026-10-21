<script setup>
import { useDebouncedSearch } from '~/composables/useDebouncedSearch.js';
import { normalizeList } from '~/utils/media.js';
import { shareHeadMeta } from '~/utils/share.js';

definePageMeta({ name: 'search' });
useHead({
	title: 'Search | ViewVerse',
	meta: shareHeadMeta({
		title: 'Search Movies and TV Shows | ViewVerse',
		description: 'Search across movies, TV shows, and people to find what you want to watch next on ViewVerse.',
		path: '/search',
	}),
});

const tmdb = useTmdb();
const inputRef = ref(null);

const activeType = ref('all');

const typeOptions = [
	{ value: 'all', label: 'All' },
	{ value: 'movie', label: 'Movies' },
	{ value: 'tv', label: 'TV' },
	{ value: 'person', label: 'People' },
];

async function fetchSearchResults(value) {
	const data = await tmdb.searchMulti(value, { include_adult: false, page: 1 });
	const results = Array.isArray(data?.results) ? data.results : [];
	return normalizeList(results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv' || r.media_type === 'person'));
}

const { query, setQuery, results, isLoading, error, lastCompletedQuery, reset } = useDebouncedSearch(fetchSearchResults, { debounceMs: 300 });

const hasQuery = computed(() => query.value.trim().length > 0);

const filteredResults = computed(() => {
	if (!results.value) return [];
	if (activeType.value === 'all') return results.value;
	return results.value.filter((r) => r.media_type === activeType.value);
});

const emptyMessage = computed(() => {
	const q = lastCompletedQuery.value;
	return `Nothing came back for "${q}". Try a shorter query, or check the spelling.`;
});

function onInput(event) {
	setQuery(event.target.value);
}

function searchAgain() {
	setQuery(query.value);
}

onMounted(async () => {
	await nextTick();
	if (inputRef.value) inputRef.value.focus();
});
</script>

<template>
	<div class="search-page">
		<header class="search-page__header">
			<h1 class="search-page__title">Search</h1>

			<div class="search-page__input-wrap">
				<svg viewBox="0 0 24 24" aria-hidden="true" class="search-page__icon">
					<path fill="none" stroke="currentColor" stroke-width="1.25" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.49-1.49zM9.5 14a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9" />
				</svg>
				<input ref="inputRef" data-search-input type="search" class="search-page__input" placeholder="Search movies, TV, people..." :value="query" aria-label="Search" autocomplete="off" autocorrect="off" spellcheck="false" @input="onInput" />
				<button v-if="query" type="button" class="search-page__clear" aria-label="Clear search" @click="reset">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path fill="none" stroke="currentColor" stroke-width="1.25" d="M5 5l14 14M19 5L5 19" />
					</svg>
				</button>
			</div>
		</header>

		<div v-if="isLoading && hasQuery" class="search-page__grid">
			<ContentGrid :items="[]" :show-skeletons="true" media-type="movie" :skeleton-count="8" />
		</div>

		<ErrorState v-else-if="error" title="Search failed" :message="error.message || 'Please try again.'" @retry="searchAgain" />

		<EmptyState v-else-if="hasQuery && results && results.length === 0" icon="search" title="No matches" :message="emptyMessage" />

		<div v-else-if="results && results.length > 0" class="search-page__results">
			<div class="search-page__results-header">
				<h2 class="search-page__results-title">
					<span class="search-page__count">{{ results.length }}</span>
					<span class="search-page__count-label">for "{{ lastCompletedQuery }}"</span>
				</h2>

				<div class="search-page__filters" role="tablist" aria-label="Filter by media type">
					<button v-for="opt in typeOptions" :key="opt.value" type="button" role="tab" class="search-page__filter" :class="{ 'is-active': activeType === opt.value }" :aria-selected="activeType === opt.value" @click="activeType = opt.value">
						{{ opt.label }}
					</button>
				</div>
			</div>

			<div v-if="filteredResults.length === 0" class="search-page__filtered-empty">
				<EmptyState icon="search" title="No matches in this filter" message="Try a different filter or clear filters to see all results." />
			</div>
			<div v-else class="search-page__grid">
				<ContentGrid :items="filteredResults" :media-type="activeType === 'tv' ? 'tv' : 'movie'" />
			</div>
		</div>

		<GenresList v-if="!hasQuery && !isLoading && !error" hide-header />
	</div>
</template>

<style scoped>
.search-page {
	padding: 40px 4vw 64px;
	max-width: var(--layout-max);
	margin: 0 auto;
}

.search-page :deep(.genres-list) {
	padding: 32px 0 48px;
}

.search-page__header {
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-bottom: 32px;
}

.search-page__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(2rem, 4vw, 2.8rem);
	font-weight: 500;
	line-height: 1.1;
	letter-spacing: -0.005em;
	color: var(--color-surface-50);
}

.search-page__input-wrap {
	position: relative;
}

.search-page__icon {
	position: absolute;
	left: 4px;
	top: 50%;
	transform: translateY(-50%);
	width: 20px;
	height: 20px;
	color: var(--color-surface-400);
	transition: color 500ms ease;
	pointer-events: none;
}

.search-page__input {
	width: 100%;
	padding: 14px 44px 14px 36px;
	background-color: transparent;
	border: 0;
	border-bottom: 1px solid var(--color-line);
	color: var(--color-surface-50);
	font-family: var(--font-display);
	font-size: clamp(1.2rem, 2.4vw, 1.5rem);
	font-weight: 400;
	letter-spacing: -0.005em;
	transition: border-color 500ms ease;
}

.search-page__input::-webkit-search-cancel-button,
.search-page__input::-webkit-search-decoration {
	appearance: none;
	-webkit-appearance: none;
	display: none;
}

.search-page__input::placeholder {
	color: var(--color-surface-500);
}

.search-page__input:focus {
	outline: none;
	border-bottom-color: var(--color-brand);
}

.search-page__input-wrap:focus-within .search-page__icon {
	color: var(--color-brand);
}

.search-page__clear {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 32px;
	height: 32px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	border: 0;
	color: var(--color-surface-400);
	cursor: pointer;
	transition: color 500ms ease;
}

.search-page__clear:hover {
	color: var(--color-brand);
}

.search-page__clear svg {
	width: 16px;
	height: 16px;
}

.search-page__results {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.search-page__results-header {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	justify-content: space-between;
	gap: 16px;
	padding-bottom: 14px;
	border-bottom: 1px solid var(--color-line);
}

.search-page__results-title {
	margin: 0;
	display: inline-flex;
	align-items: baseline;
	gap: 8px;
	font-family: var(--font-display);
	font-size: 1rem;
	font-weight: 500;
	color: var(--color-surface-200);
}

.search-page__count {
	color: var(--color-brand);
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 1rem;
	letter-spacing: 0.02em;
}

.search-page__count-label {
	color: var(--color-surface-400);
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.95rem;
	letter-spacing: 0.02em;
}

.search-page__filters {
	display: inline-flex;
	gap: 0;
	border: 1px solid var(--color-line);
	border-radius: 0;
}

.search-page__filter {
	padding: 6px 14px;
	background-color: transparent;
	color: var(--color-surface-400);
	border: 0;
	border-right: 1px solid var(--color-line);
	font-family: var(--font-sans);
	font-size: 0.82rem;
	font-weight: 500;
	letter-spacing: 0.02em;
	cursor: pointer;
	transition:
		color 500ms ease,
		background-color 500ms ease;
}

.search-page__filter:last-child {
	border-right: 0;
}

.search-page__filter:hover {
	color: var(--color-surface-50);
}

.search-page__filter.is-active {
	background-color: var(--color-brand);
	color: var(--color-brand-ink);
}

.search-page__filtered-empty {
	padding: 16px 0;
}

.search-page__grid {
	margin-top: 4px;
}
</style>
