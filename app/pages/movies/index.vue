<script setup>
import { ref } from 'vue';
import { normalizeList } from '~/utils/media.js';

definePageMeta({ name: 'movies' });
useHead({ title: 'ViewVerse. Movies' });

const tmdb = useTmdb();

const items = ref([]);
const pending = ref(true);
const error = ref(null);

async function load() {
	pending.value = true;
	error.value = null;
	try {
		const data = await tmdb.moviePopular();
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
		title="Movies. Popular"
		subtitle="Discover the latest blockbusters and timeless classics."
		:tabs="[
			{ to: '/movies', label: 'Popular' },
			{ to: '/movies/top-rated', label: 'Top Rated' },
			{ to: '/movies/upcoming', label: 'Upcoming' },
			{ to: '/movies/now-playing', label: 'Now Playing' },
		]">
		<div v-if="pending">
			<ContentGrid :items="[]" :show-skeletons="true" media-type="movie" />
		</div>
		<ErrorState v-else-if="error" :message="error.message" @retry="refresh" />
		<EmptyState icon="film" v-else-if="items.length === 0" title="No movies to show" message="We couldn't find any movies in this category." />
		<ContentGrid v-else :items="items" media-type="movie" />
	</CategoryListPage>
</template>
