<script setup>
import { computed, ref as refVar, watch } from 'vue';

const props = defineProps({
	src: { type: String, default: null },
	alt: { type: String, default: '' },
	ratio: { type: String, default: '2/3' },
	rounded: { type: String, default: 'none' },
	loading: { type: String, default: 'lazy' },
	decoding: { type: String, default: 'async' },
	fetchpriority: { type: String, default: 'auto' },
});

const hasLoaded = refVar(false);
const errored = refVar(false);

function onLoad() {
	hasLoaded.value = true;
	errored.value = false;
}

function onError() {
	errored.value = true;
	hasLoaded.value = true;
}

watch(
	() => props.src,
	() => {
		hasLoaded.value = false;
		errored.value = false;
	},
);

const containerStyle = computed(() => {
	const radius = props.rounded === 'full' ? '9999px' : props.rounded === 'lg' ? '4px' : props.rounded === 'sm' ? '2px' : props.rounded === 'none' ? '0' : '0';
	return {
		aspectRatio: props.ratio.replace('/', ' / '),
		borderRadius: radius,
	};
});
</script>

<template>
	<div class="tmdb-img" :class="[`tmdb-img--${rounded}`, { 'tmdb-img--has-image': hasLoaded && !errored }]" :style="containerStyle">
		<img v-if="src" :src="src" :alt="alt" :loading="loading" :decoding="decoding" :fetchpriority="fetchpriority" @load="onLoad" @error="onError" />
		<div v-else-if="!hasLoaded" class="tmdb-img__placeholder" aria-hidden="true">
			<svg viewBox="0 0 24 24" class="tmdb-img__placeholder-icon">
				<path fill="none" stroke="currentColor" stroke-width="1.25" d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5L19 18H5z" />
			</svg>
		</div>
		<div v-if="errored" class="tmdb-img__fallback" aria-hidden="true">
			<svg viewBox="0 0 24 24" class="tmdb-img__fallback-icon">
				<path fill="none" stroke="currentColor" stroke-width="1.25" d="M21 5v11l-3-3-4 4-4-4-7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
			</svg>
		</div>
	</div>
</template>

<style scoped>
.tmdb-img {
	position: relative;
	display: block;
	width: 100%;
	overflow: hidden;
	background-color: var(--color-surface-800);
	color: var(--color-surface-700);
}

.tmdb-img img {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0;
	transition: opacity 280ms ease;
}

.tmdb-img--has-image img {
	opacity: 1;
}

.tmdb-img__placeholder,
.tmdb-img__fallback {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, var(--color-surface-800) 0%, var(--color-bg-elevated) 100%);
}

.tmdb-img__placeholder-icon,
.tmdb-img__fallback-icon {
	width: 36%;
	height: 36%;
	max-width: 56px;
	max-height: 56px;
	color: var(--color-surface-700);
}
</style>
