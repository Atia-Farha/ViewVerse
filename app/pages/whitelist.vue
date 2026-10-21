<script setup>
import { posterThumb } from '~/utils/tmdb.js';
import { shareHeadMeta } from '~/utils/share.js';

definePageMeta({ name: 'whitelist' });
useHead({
	title: 'My Watchlist | ViewVerse',
	meta: shareHeadMeta({
		title: 'My Watchlist | ViewVerse',
		description: 'Your saved watchlist of movies and TV shows on ViewVerse.',
		path: '/whitelist',
	}),
});

const router = useRouter();
const toast = useToast();
const { items, count, movies, tvShows, remove, clear } = useWhitelist();

const activeType = ref('all');

const typeOptions = [
	{ value: 'all', label: 'All' },
	{ value: 'movie', label: 'Movies' },
	{ value: 'tv', label: 'TV Shows' },
];

const counts = computed(() => ({
	all: items.value.length,
	movie: movies.value.length,
	tv: tvShows.value.length,
}));

const filteredItems = computed(() => {
	if (activeType.value === 'all') return items.value;
	return items.value.filter((item) => item.media_type === activeType.value);
});

function posterUrl(item) {
	return posterThumb(item.poster_path);
}

function play(item) {
	if (item.media_type === 'tv') {
		router.push(`/tv/${item.id}`);
	} else {
		router.push(`/watch/movie/${item.id}`);
	}
}

function removeItem(item) {
	const ok = remove(item.id, item.media_type);
	if (ok) {
		toast.info(`"${item.title}" removed from My List.`);
	}
}

function onClear() {
	const countBefore = items.value.length;
	const ok = typeof window !== 'undefined' && window.confirm('Clear your entire list?');
	if (ok) {
		clear();
		toast.info(`Cleared ${countBefore} item${countBefore === 1 ? '' : 's'} from My List.`);
	}
}

function formatRelative(timestamp) {
	if (typeof timestamp !== 'number') return '';
	const diffMs = Date.now() - timestamp;
	const day = 24 * 60 * 60 * 1000;
	if (diffMs < day) return 'added today';
	if (diffMs < 7 * day) return `added ${Math.round(diffMs / day)}d ago`;
	if (diffMs < 30 * day) return `added ${Math.round(diffMs / (7 * day))}w ago`;
	return `added ${Math.round(diffMs / (30 * day))}mo ago`;
}

function goTo(path) {
	router.push(path);
}
</script>

<template>
	<div class="page-shell whitelist-page">
		<header class="whitelist-page__header">
			<h1 class="t-display-2 whitelist-page__title">My List</h1>
			<p class="t-meta whitelist-page__subtitle">
				<span class="whitelist-page__count">{{ count }}</span>
				item{{ count === 1 ? '' : 's' }} saved · stored on this device only.
			</p>
			<div class="whitelist-page__filters" role="tablist" aria-label="Filter list">
				<button v-for="opt in typeOptions" :key="opt.value" type="button" class="whitelist-page__filter" :class="{ 'is-active': activeType === opt.value }" :aria-pressed="activeType === opt.value" @click="activeType = opt.value">{{ opt.label }} ({{ counts[opt.value] }})</button>
				<button v-if="items.length > 0" type="button" class="whitelist-page__clear" @click="onClear">Clear list</button>
			</div>
		</header>

		<EmptyState icon="bookmark" v-if="items.length === 0" title="Your list is empty" message="Add movies and TV shows to find them here later.">
			<Button variant="primary" size="md" @click="goTo('/')">Browse content</Button>
		</EmptyState>

		<EmptyState icon="list" v-else-if="filteredItems.length === 0" title="No items in this filter" message="Try a different filter or add more titles." />

		<div v-else class="whitelist-page__grid">
			<article v-for="item in filteredItems" :key="`${item.media_type}:${item.id}`" class="whitelist-card">
				<NuxtLink :to="item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`" class="whitelist-card__poster">
					<TmdbImage :src="posterUrl(item)" :alt="item.title" ratio="2/3" rounded="sm" />
				</NuxtLink>
				<div class="whitelist-card__body">
					<h3 class="whitelist-card__title">
						<NuxtLink :to="item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`" class="whitelist-card__link">
							{{ item.title }}
						</NuxtLink>
					</h3>
					<p class="whitelist-card__type">{{ item.media_type === 'tv' ? 'TV Show' : 'Movie' }} · {{ formatRelative(item.added_at) }}</p>
					<div class="whitelist-card__actions">
						<Button variant="primary" size="sm" @click="play(item)">Play</Button>
						<Button variant="secondary" size="sm" @click="removeItem(item)">Remove</Button>
					</div>
				</div>
			</article>
		</div>
	</div>
</template>

<style scoped>
.whitelist-page__header {
	margin-bottom: 32px;
	padding-bottom: 24px;
	border-bottom: 1px solid var(--color-line);
}

.whitelist-page__title {
	margin: 6px 0 8px;
}

.whitelist-page__subtitle {
	margin: 0 0 20px;
}

.whitelist-page__count {
	color: var(--color-brand);
	font-feature-settings: 'tnum' 1;
	margin-right: 4px;
}

.whitelist-page__filters {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	align-items: center;
}

.whitelist-page__filter {
	padding: 6px 12px;
	background-color: transparent;
	color: var(--color-surface-400);
	border: 1px solid var(--color-line);
	border-radius: 0;
	font-family: var(--font-sans);
	font-size: 0.78rem;
	font-weight: 500;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	cursor: pointer;
	transition:
		color 500ms ease,
		border-color 500ms ease,
		background-color 500ms ease;
}

.whitelist-page__filter:hover {
	color: var(--color-brand);
	border-color: var(--color-brand);
}

.whitelist-page__filter.is-active {
	background-color: var(--color-brand);
	color: var(--color-brand-ink);
	border-color: var(--color-brand);
}

.whitelist-page__clear {
	margin-left: auto;
	padding: 6px 12px;
	background-color: transparent;
	color: var(--color-surface-400);
	border: 1px solid var(--color-line);
	border-radius: 0;
	font-family: var(--font-sans);
	font-size: 0.78rem;
	font-weight: 500;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	cursor: pointer;
	transition:
		color 500ms ease,
		border-color 500ms ease;
}

.whitelist-page__clear:hover {
	color: var(--color-danger);
	border-color: var(--color-danger);
}

.whitelist-page__grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 0;
	border-top: 1px solid var(--color-line);
}

.whitelist-card {
	position: relative;
	display: grid;
	grid-template-columns: 96px 1fr;
	gap: 16px;
	padding: 16px 12px;
	border-bottom: 1px solid var(--color-line);
	border-left: 2px solid transparent;
	transition:
		border-left-color 500ms ease,
		background-color 500ms ease;
}

.whitelist-card:hover {
	border-left-color: var(--color-brand);
	background-color: rgba(240, 180, 41, 0.02);
}

.whitelist-card__poster {
	display: block;
	width: 96px;
}

.whitelist-card__body {
	display: flex;
	flex-direction: column;
	gap: 6px;
	min-width: 0;
}

.whitelist-card__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.05rem;
	font-weight: 500;
	letter-spacing: -0.01em;
	color: var(--color-surface-50);
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	transition: color 500ms ease;
}

.whitelist-card:hover .whitelist-card__title {
	color: var(--color-brand);
}

.whitelist-card__link {
	color: inherit;
	text-decoration: none;
}

.whitelist-card__type {
	margin: 0;
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.72rem;
	color: var(--color-surface-400);
	letter-spacing: 0.04em;
}

.whitelist-card__actions {
	display: flex;
	gap: 6px;
	margin-top: auto;
	padding-top: 6px;
}
</style>
