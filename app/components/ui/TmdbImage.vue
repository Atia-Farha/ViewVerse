<script setup>
import { computed, nextTick, onMounted, ref as refVar, watch } from 'vue';

/**
 * TMDB serves each image at a fixed width, so the bucket in the URL implies
 * the intrinsic size — no need for the caller to pass it. Posters and
 * backdrops share some buckets (`w780` is either one), so which table to read
 * is decided by the `ratio` prop the caller already passes.
 *
 * Emitting `width`/`height` lets the browser reserve the box before a byte of
 * image data arrives, which is what keeps CLS at zero for the card grids.
 */
const POSTER_DIMS = {
	w185: [185, 278],
	w342: [342, 513],
	w500: [500, 750],
	w780: [780, 1170],
};
const BACKDROP_DIMS = {
	w300: [300, 169],
	w780: [780, 439],
	w1280: [1280, 720],
	original: [2000, 1125],
};
const PROFILE_DIMS = {
	w185: [185, 185],
	h632: [632, 632],
};
const STILL_DIMS = {
	w185: [185, 104],
	w300: [300, 169],
	original: [2000, 1125],
};

function tableForRatio(ratio) {
	const parts = typeof ratio === 'string' ? ratio.split('/').map(Number) : [];
	const a = parts[0];
	const b = parts[1];
	if (!a || !b) return POSTER_DIMS;
	const r = a / b;
	if (Math.abs(r - 1) < 0.02) return PROFILE_DIMS;
	if (Math.abs(r - 16 / 9) < 0.02) return null;
	if (Math.abs(r - 2 / 3) < 0.02) return POSTER_DIMS;
	return null;
}

function bucketFromUrl(url) {
	if (typeof url !== 'string') return null;
	const m = url.match(/\/t\/p\/([^/]+)\//);
	return m ? m[1] : null;
}

const props = defineProps({
	src: { type: String, default: null },
	alt: { type: String, default: '' },
	ratio: { type: String, default: '2/3' },
	rounded: { type: String, default: 'none' },
	loading: { type: String, default: 'lazy' },
	decoding: { type: String, default: 'async' },
	fetchpriority: { type: String, default: 'auto' },
	width: { type: [Number, null], default: null },
	height: { type: [Number, null], default: null },
});

const hasLoaded = refVar(false);
const errored = refVar(false);
const imgEl = refVar(null);

function onLoad() {
	hasLoaded.value = true;
	errored.value = false;
}

function onError() {
	errored.value = true;
	hasLoaded.value = true;
}

function syncLoadState() {
	const el = imgEl.value;
	if (!el) return;
	if (el.complete) {
		if (el.naturalWidth > 0) {
			hasLoaded.value = true;
			errored.value = false;
		} else {
			errored.value = true;
			hasLoaded.value = true;
		}
	}
}

onMounted(syncLoadState);

watch(
	() => props.src,
	() => {
		hasLoaded.value = false;
		errored.value = false;
		nextTick(syncLoadState);
	},
);

const intrinsicDims = computed(() => {
	if (props.width && props.height) return { width: props.width, height: props.height };
	const bucket = bucketFromUrl(props.src);
	if (!bucket) return { width: null, height: null };

	let table = tableForRatio(props.ratio);
	if (!table) {
		table = STILL_DIMS[bucket] ? STILL_DIMS : BACKDROP_DIMS;
	}

	const dims = table[bucket];
	return dims ? { width: dims[0], height: dims[1] } : { width: null, height: null };
});

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
		<img v-if="src" ref="imgEl" :src="src" :alt="alt" :loading="loading" :decoding="decoding" :fetchpriority="fetchpriority" :width="intrinsicDims.width || undefined" :height="intrinsicDims.height || undefined" @load="onLoad" @error="onError" />
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
	transition: opacity 500ms ease;
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
