<script setup>
import { computed, ref, watch } from 'vue';
import { normalizeList } from '~/utils/media.js';

definePageMeta({ name: 'genre' });

const route = useRoute();
const tmdb = useTmdb();

const genreId = computed(() => {
	const id = Number(route.params.id);
	return Number.isFinite(id) && id > 0 ? id : null;
});

const activeType = ref('movie');

const typeOptions = [
	{ value: 'movie', label: 'Movies' },
	{ value: 'tv', label: 'TV' },
];

const items = ref([]);
const genreName = ref('Genre');
const pending = ref(true);
const error = ref(null);

async function loadGenreMeta() {
	if (!genreId.value) return;
	try {
		const [movies, tv] = await Promise.all([tmdb.genresMovie(), tmdb.genresTv()]);
		const fromMovies = Array.isArray(movies?.genres) ? movies.genres : [];
		const fromTv = Array.isArray(tv?.genres) ? tv.genres : [];
		const all = [...fromMovies, ...fromTv];
		const match = all.find((g) => g.id === genreId.value);
		if (match?.name) genreName.value = match.name;
	} catch {}
}

async function load() {
	if (!genreId.value) {
		error.value = Object.assign(new Error('Invalid genre id'), { status: 404 });
		pending.value = false;
		return;
	}
	pending.value = true;
	error.value = null;
	try {
		const path = activeType.value === 'tv' ? '/discover/tv' : '/discover/movie';
		const data = await tmdb.fetchRaw(path, { with_genres: genreId.value, sort_by: 'popularity.desc' });
		items.value = normalizeList(data?.results || []);
	} catch (err) {
		error.value = err;
		items.value = [];
	} finally {
		pending.value = false;
	}
}

async function refresh() {
	await load();
}

watch(activeType, () => {
	load();
});

await Promise.all([loadGenreMeta(), load()]);

useHead(() => ({
	title: `${genreName.value}. ViewVerse`,
}));
</script>

<template>
	<div class="page-shell genre-page">
		<header class="genre-page__header">
			<span class="genre-page__eyebrow">Genre</span>
			<h1 class="genre-page__title">{{ genreName }}</h1>
			<nav class="genre-page__tabs" aria-label="Media type">
				<button v-for="opt in typeOptions" :key="opt.value" type="button" class="genre-page__tab" :class="{ 'is-active': activeType === opt.value }" @click="activeType = opt.value">
					{{ opt.label }}
				</button>
			</nav>
		</header>

		<div v-if="pending" class="genre-page__grid">
			<ContentGrid :items="[]" :show-skeletons="true" :media-type="activeType === 'tv' ? 'tv' : 'movie'" />
		</div>

		<ErrorState v-else-if="error" :message="error.message || 'Please try again.'" @retry="refresh" />

		<EmptyState v-else-if="items.length === 0" icon="film" :title="`No ${activeType === 'tv' ? 'TV shows' : 'movies'} found`" message="We couldn't find anything in this genre yet." />

		<div v-else class="genre-page__grid">
			<ContentGrid :items="items" :media-type="activeType === 'tv' ? 'tv' : 'movie'" />
		</div>
	</div>
</template>

<style scoped>
.genre-page__header {
	margin-bottom: 28px;
	padding-bottom: 18px;
	border-bottom: 1px solid var(--color-line);
}

.genre-page__eyebrow {
	display: block;
	font-family: var(--font-mono);
	font-size: 0.7rem;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand);
}

.genre-page__title {
	margin: 6px 0 16px;
	font-family: var(--font-display);
	font-size: clamp(1.8rem, 4vw, 2.8rem);
	font-weight: 500;
	line-height: 1.1;
	letter-spacing: -0.005em;
	color: var(--color-surface-50);
	text-wrap: balance;
}

.genre-page__tabs {
	display: flex;
	flex-wrap: wrap;
	gap: 24px;
}

.genre-page__tab {
	position: relative;
	display: inline-block;
	padding: 10px 0 14px;
	background: transparent;
	border: 0;
	color: var(--color-surface-400);
	font-family: var(--font-sans);
	font-size: 0.78rem;
	font-weight: 500;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	cursor: pointer;
	transition: color 160ms ease;
}

.genre-page__tab:hover {
	color: var(--color-surface-50);
}

.genre-page__tab.is-active {
	color: var(--color-surface-50);
}

.genre-page__tab.is-active::after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: -1px;
	height: 2px;
	background-color: var(--color-brand);
}

.genre-page__grid {
	margin-top: 8px;
}
</style>
