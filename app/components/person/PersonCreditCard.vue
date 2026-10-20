<script setup>
import { computed } from 'vue';
import { posterThumb } from '~/utils/tmdb.js';

const props = defineProps({
	item: { type: Object, default: null },
});

const posterSrc = computed(() => posterThumb(props.item?.poster_path));

const link = computed(() => {
	if (!props.item) return '#';
	if (props.item.media_type === 'tv') return `/tv/${props.item.id}`;
	return `/movie/${props.item.id}`;
});
</script>

<template>
	<NuxtLink v-if="item" :to="link" class="credit-card" :aria-label="`Open ${item.title || 'title'}`">
		<div class="credit-card__poster">
			<TmdbImage :src="posterSrc" :alt="item.title || ''" ratio="2/3" rounded="sm" />
			<span class="credit-card__rule" aria-hidden="true" />
		</div>
		<div class="credit-card__caption">
			<h3 class="credit-card__title">{{ item.title }}</h3>
		</div>
	</NuxtLink>
</template>

<style scoped>
.credit-card {
	display: flex;
	flex-direction: column;
	gap: 10px;
	text-decoration: none;
	color: inherit;
	border-radius: 0;
}

.credit-card__poster {
	position: relative;
	width: 100%;
	overflow: hidden;
}

.credit-card__rule {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 2px;
	background-color: var(--color-brand);
	transform: scaleX(0);
	transform-origin: left center;
	transition: transform 500ms ease;
	pointer-events: none;
}

.credit-card:hover .credit-card__rule,
.credit-card:focus-visible .credit-card__rule {
	transform: scaleX(1);
}

.credit-card__caption {
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 0 2px;
}

.credit-card__title {
	margin: 0;
	font-family: var(--font-sans);
	font-size: 0.85rem;
	font-weight: 500;
	color: var(--color-surface-50);
	line-height: 1.3;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	transition: color 500ms ease;
}

.credit-card:hover .credit-card__title {
	color: var(--color-brand);
}
</style>
