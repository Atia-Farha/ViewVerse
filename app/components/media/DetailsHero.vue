<script setup>
import { computed } from 'vue';
import { backdropLarge } from '~/utils/tmdb.js';

const props = defineProps({
	backdropPath: { type: String, default: null },
});

const backdrop = computed(() => {
	const url = backdropLarge(props.backdropPath);
	if (!url) return null;
	return { url };
});
</script>

<template>
	<section class="details-hero">
		<img v-if="backdrop" class="details-hero__img" :src="backdrop.url" alt="" width="1280" height="720" fetchpriority="high" decoding="async" />
		<div class="hero-gradient details-hero__gradient" />
	</section>
</template>

<style scoped>
.details-hero {
	position: relative;
	height: 56vh;
	max-height: 640px;
	background-color: var(--color-bg-elevated);
	overflow: hidden;
}

.details-hero__img {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center;
}

.details-hero__gradient {
	position: absolute;
	inset: 0;
	pointer-events: none;
}
</style>
