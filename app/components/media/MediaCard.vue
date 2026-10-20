<script setup>
import { computed } from 'vue';
import { posterThumb } from '~/utils/tmdb.js';

const props = defineProps({
	item: { type: Object, default: null },
	mediaType: { type: String, default: null },
});

const posterSrc = computed(() => posterThumb(props.item?.poster_path));
const link = computed(() => {
	if (!props.item) return '#';
	const type = props.mediaType || props.item.media_type || 'movie';
	return `/${type}/${props.item.id}`;
});

function formatRatingDisplay(value) {
	const n = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(n) || n <= 0) return null;
	return n.toFixed(1);
}
</script>

<template>
	<NuxtLink v-if="item" :to="link" class="media-card" :aria-label="`Open ${item.title || 'item'}`">
		<div class="media-card__poster">
			<TmdbImage :src="posterSrc" :alt="item.title || ''" ratio="2/3" rounded="sm" />
			<span class="media-card__rule" aria-hidden="true" />
		</div>
		<div class="media-card__caption">
			<h3 class="media-card__title">{{ item.title }}</h3>
			<p class="media-card__meta">
				<span v-if="item.year">{{ item.year }}</span>
				<span v-if="item.rating !== null && item.rating !== undefined" class="media-card__rating"> · {{ formatRatingDisplay(item.rating) }} </span>
			</p>
		</div>
	</NuxtLink>
</template>

<style scoped>
.media-card {
	display: flex;
	flex-direction: column;
	gap: 10px;
	text-decoration: none;
	color: inherit;
	border-radius: 0;
}

.media-card__poster {
	position: relative;
	width: 100%;
	overflow: hidden;
}

.media-card__rule {
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

.media-card:hover .media-card__rule,
.media-card:focus-visible .media-card__rule {
	transform: scaleX(1);
}

.media-card__caption {
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 0 2px;
}

.media-card__title {
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

.media-card:hover .media-card__title {
	color: var(--color-brand);
}

.media-card__meta {
	margin: 0;
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.72rem;
	color: var(--color-surface-400);
	letter-spacing: 0.04em;
}

.media-card__rating {
	color: var(--color-brand);
}
</style>
