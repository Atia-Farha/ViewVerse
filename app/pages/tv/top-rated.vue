<script setup>
import { normalizeList } from '~/utils/media.js';
import { shareHeadMeta } from '~/utils/share.js';

definePageMeta({ name: 'tv-top-rated' });
useHead({
	title: 'Top Rated TV Shows | ViewVerse',
	meta: shareHeadMeta({
		title: 'Top Rated TV Shows | ViewVerse',
		description: 'See the highest-rated TV shows of all time, ranked by community votes on ViewVerse',
		path: '/tv/top-rated',
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
		const data = await tmdb.tvTopRated();
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
		title="TV Shows. Top Rated"
		subtitle="The highest-rated series of all time."
		:tabs="[
			{ to: '/tv', label: 'Popular' },
			{ to: '/tv/top-rated', label: 'Top Rated' },
			{ to: '/tv/airing-today', label: 'Airing Today' },
			{ to: '/tv/on-the-air', label: 'On The Air' },
		]">
		<div v-if="pending">
			<ContentGrid :items="[]" :show-skeletons="true" media-type="tv" />
		</div>
		<ErrorState v-else-if="error" title="Unable to load top rated TV shows" :message="error.message" @retry="refresh" />
		<EmptyState icon="tv" v-else-if="items.length === 0" title="No shows to show" message="We couldn't find any TV shows in this category." />
		<ContentGrid v-else :items="items" media-type="tv" />
	</CategoryListPage>
</template>
