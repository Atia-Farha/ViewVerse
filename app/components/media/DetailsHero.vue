<script setup>
import { computed } from 'vue';
import { backdropLarge } from '~/utils/tmdb.js';

const props = defineProps({
	backdropPath: { type: String, default: null },
});

const style = computed(() => {
	const url = backdropLarge(props.backdropPath);
	if (!url) return {};
	return { backgroundImage: `url(${url})` };
});
</script>

<template>
	<section class="details-hero" :style="style">
		<div class="hero-gradient details-hero__gradient" />
	</section>
</template>

<style scoped>
.details-hero {
	position: relative;
	height: 56vh;
	max-height: 640px;
	background-color: var(--color-bg-elevated);
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}

.details-hero__gradient {
	position: absolute;
	inset: 0;
	pointer-events: none;
}
</style>
