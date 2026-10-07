<script setup>
import { ref } from 'vue';
import { normalizeList } from '~/utils/media.js';

definePageMeta({ name: 'tv-airing-today' });
useHead({ title: 'ViewVerse. Airing Today' });

const tmdb = useTmdb();

const items = ref([]);
const pending = ref(true);
const error = ref(null);

async function load() {
	pending.value = true;
	error.value = null;
	try {
		const data = await tmdb.tvAiringToday();
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
		title="TV Shows. Airing Today"
		subtitle="Episodes dropping today."
		:tabs="[
			{ to: '/tv', label: 'Popular' },
			{ to: '/tv/top-rated', label: 'Top Rated' },
			{ to: '/tv/airing-today', label: 'Airing Today' },
			{ to: '/tv/on-the-air', label: 'On The Air' },
		]">
		<div v-if="pending">
			<ContentGrid :items="[]" :show-skeletons="true" media-type="tv" />
		</div>
		<ErrorState v-else-if="error" :message="error.message" @retry="refresh" />
		<EmptyState icon="tv" v-else-if="items.length === 0" title="Nothing airing today" message="We couldn't find any shows airing today." />
		<ContentGrid v-else :items="items" media-type="tv" />
	</CategoryListPage>
</template>
