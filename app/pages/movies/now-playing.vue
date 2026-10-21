<script setup>
import { normalizeList } from '~/utils/media.js';
import { shareHeadMeta } from '~/utils/share.js';

definePageMeta({ name: 'movies-now-playing' });
useHead({
	title: 'Now Playing in Theaters | ViewVerse',
	meta: shareHeadMeta({
		title: 'Now Playing in Theaters | ViewVerse',
		description: 'See movies currently playing in theaters on ViewVerse.',
		path: '/movies/now-playing',
	}),
});

const tmdb = useTmdb();

const items = ref([]);
const pending = ref(true);
const error = ref(null);

async function load() {
	pending.value = true;
	error.value = null;
	try {
		const data = await tmdb.movieNowPlaying();
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

await load();
</script>

<template>
	<CategoryListPage
		title="Movies. Now Playing"
		subtitle="Currently in theaters and on demand."
		:tabs="[
			{ to: '/movies', label: 'Popular' },
			{ to: '/movies/top-rated', label: 'Top Rated' },
			{ to: '/movies/upcoming', label: 'Upcoming' },
			{ to: '/movies/now-playing', label: 'Now Playing' },
		]">
		<div v-if="pending">
			<ContentGrid :items="[]" :show-skeletons="true" media-type="movie" />
		</div>
		<ErrorState v-else-if="error" title="Unable to load movies in theaters" :message="error.message" @retry="refresh" />
		<EmptyState icon="film" v-else-if="items.length === 0" title="No movies in theaters" message="We couldn't find any movies currently playing." />
		<ContentGrid v-else :items="items" media-type="movie" />
	</CategoryListPage>
</template>
