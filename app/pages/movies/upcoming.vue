<script setup>
import { normalizeList } from '~/utils/media.js';
import { shareHeadMeta } from '~/utils/share.js';

definePageMeta({ name: 'movies-upcoming' });
useHead({
	title: 'Upcoming Movies | ViewVerse',
	meta: shareHeadMeta({
		title: 'Upcoming Movies | ViewVerse',
		description: 'Get an early look at the most anticipated upcoming movies on ViewVerse.',
		path: '/movies/upcoming',
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
		const data = await tmdb.movieUpcoming();
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
		title="Movies. Upcoming"
		subtitle="Coming soon to a screen near you."
		:tabs="[
			{ to: '/movies', label: 'Popular' },
			{ to: '/movies/top-rated', label: 'Top Rated' },
			{ to: '/movies/upcoming', label: 'Upcoming' },
			{ to: '/movies/now-playing', label: 'Now Playing' },
		]">
		<div v-if="pending">
			<ContentGrid :items="[]" :show-skeletons="true" media-type="movie" />
		</div>
		<ErrorState v-else-if="error" title="Unable to load upcoming movies" :message="error.message" @retry="refresh" />
		<EmptyState icon="film" v-else-if="items.length === 0" title="No upcoming movies" message="We couldn't find any upcoming releases right now." />
		<ContentGrid v-else :items="items" media-type="movie" />
	</CategoryListPage>
</template>
