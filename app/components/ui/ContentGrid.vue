<script setup>
import MovieCard from '~/components/movie/MovieCard.vue';
import TvCard from '~/components/tv/TvCard.vue';
import PersonCard from '~/components/person/PersonCard.vue';

const props = defineProps({
	items: { type: Array, default: () => [] },
	mediaType: { type: String, default: 'movie' },
	showSkeletons: { type: Boolean, default: false },
	skeletonCount: { type: Number, default: 12 },
	size: { type: String, default: 'md' },
});

function componentFor(item) {
	if (item?.media_type === 'person') return PersonCard;
	if (item?.media_type === 'tv' || props.mediaType === 'tv') return TvCard;
	return MovieCard;
}

function keyFor(item) {
	if (!item || !item.id) return '';
	return `${item.media_type || props.mediaType}:${item.id}`;
}
</script>

<template>
	<div class="content-grid" :class="`content-grid--${size}`">
		<component :is="componentFor(item)" v-for="item in items" :key="keyFor(item)" :item="item" />
		<template v-if="showSkeletons">
			<div v-for="i in skeletonCount" :key="`skeleton-${i}`" class="content-grid__skeleton">
				<Skeleton height="100%" rounded="none" />
			</div>
		</template>
	</div>
</template>

<style scoped>
.content-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 18px 14px;
}

@media (min-width: 480px) {
	.content-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media (min-width: 768px) {
	.content-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 22px 18px;
	}
}

@media (min-width: 1024px) {
	.content-grid {
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}
}

@media (min-width: 1280px) {
	.content-grid {
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}
}

.content-grid--sm {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
	.content-grid--sm {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

@media (min-width: 1024px) {
	.content-grid--sm {
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}
}

.content-grid--lg {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
	.content-grid--lg {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media (min-width: 1024px) {
	.content-grid--lg {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.content-grid__skeleton {
	aspect-ratio: 2 / 3;
}
</style>
