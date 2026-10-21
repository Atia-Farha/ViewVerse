<script setup>
import { profileImage } from '~/utils/tmdb.js';

const props = defineProps({
	item: { type: Object, default: null },
});

const portraitSrc = computed(() => profileImage(props.item?.poster_path, 'w185'));
const link = computed(() => (props.item ? `/person/${props.item.id}` : '#'));
</script>

<template>
	<NuxtLink v-if="item" :to="link" class="person-card" :aria-label="`Open ${item.title || 'person'}`">
		<div class="person-card__portrait">
			<TmdbImage :src="portraitSrc" :alt="item.title || ''" ratio="1/1" rounded="full" />
			<span class="person-card__rule" aria-hidden="true" />
		</div>
		<div class="person-card__caption">
			<h3 class="person-card__name">{{ item.title }}</h3>
			<p v-if="item.known_for" class="person-card__meta">{{ item.known_for }}</p>
		</div>
	</NuxtLink>
</template>

<style scoped>
.person-card {
	display: flex;
	flex-direction: column;
	gap: 10px;
	text-decoration: none;
	color: inherit;
	border-radius: 0;
}

.person-card__portrait {
	position: relative;
	width: 100%;
	overflow: hidden;
	border: 1px solid var(--color-line);
}

.person-card__rule {
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

.person-card:hover .person-card__rule,
.person-card:focus-visible .person-card__rule {
	transform: scaleX(1);
}

.person-card__caption {
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 0 2px;
}

.person-card__name {
	margin: 0;
	font-family: var(--font-sans);
	font-size: 0.85rem;
	font-weight: 500;
	color: var(--color-surface-50);
	line-height: 1.3;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
	transition: color 500ms ease;
}

.person-card:hover .person-card__name {
	color: var(--color-brand);
}

.person-card__meta {
	margin: 0;
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.7rem;
	color: var(--color-surface-400);
	letter-spacing: 0.02em;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
