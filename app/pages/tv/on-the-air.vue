<script setup>
import { ref } from 'vue';
import { normalizeList } from '~/utils/media.js';

definePageMeta({ name: 'tv-on-the-air' });
useHead({ title: 'ViewVerse. On The Air' });

const tmdb = useTmdb();

const items = ref([]);
const pending = ref(true);
const error = ref(null);

async function load() {
	pending.value = true;
	error.value = null;
	try {
		const data = await tmdb.tvOnTheAir();
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
		title="TV Shows. On The Air"
		subtitle="Currently airing new episodes."
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
		<EmptyState icon="tv" v-else-if="items.length === 0" title="No shows on the air" message="We couldn't find any shows currently airing." />
		<ContentGrid v-else :items="items" media-type="tv" />
	</CategoryListPage>
</template>
