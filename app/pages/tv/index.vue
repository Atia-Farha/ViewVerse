<script setup>
import { normalizeList } from '~/utils/media.js';
import { shareHeadMeta } from '~/utils/share.js';

definePageMeta({ name: 'tv' });
useHead({
	title: 'Popular TV Shows | ViewVerse',
	meta: shareHeadMeta({
		title: 'Popular TV Shows | ViewVerse',
		description: 'Discover the most popular TV shows right now on ViewVerse.',
		path: '/tv',
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
		const data = await tmdb.tvPopular();
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
		title="TV Shows. Popular"
		subtitle="Binge-worthy series from around the world."
		:tabs="[
			{ to: '/tv', label: 'Popular' },
			{ to: '/tv/top-rated', label: 'Top Rated' },
			{ to: '/tv/airing-today', label: 'Airing Today' },
			{ to: '/tv/on-the-air', label: 'On The Air' },
		]">
		<div v-if="pending">
			<ContentGrid :items="[]" :show-skeletons="true" media-type="tv" />
		</div>
		<ErrorState v-else-if="error" title="Unable to load popular TV shows" :message="error.message" @retry="refresh" />
		<EmptyState icon="tv" v-else-if="items.length === 0" title="No shows to show" message="We couldn't find any TV shows in this category." />
		<ContentGrid v-else :items="items" media-type="tv" />
	</CategoryListPage>
</template>
