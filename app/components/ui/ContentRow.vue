<script setup>
const props = defineProps({
	title: { type: String, required: true },
	items: { type: Array, default: () => [] },
	viewAllHref: { type: [String, null], default: null },
	hideWhenEmpty: { type: Boolean, default: false },
	index: { type: [String, Number], default: null },
	keyFor: {
		type: Function,
		default: (item) => (item && item.id ? `${item.media_type || ''}:${item.id}` : ''),
	},
});

const scrollerRef = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
let resizeObserver = null;

const shouldRender = computed(() => {
	if (props.hideWhenEmpty) return Array.isArray(props.items) && props.items.length > 0;
	return true;
});

function updateScrollState() {
	const el = scrollerRef.value;
	if (!el) return;
	canScrollLeft.value = el.scrollLeft > 4;
	canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
}

function onScroll() {
	updateScrollState();
}

function scrollBy(direction) {
	const el = scrollerRef.value;
	if (!el) return;
	const amount = el.clientWidth * 0.85 * direction;
	el.scrollBy({ left: amount, behavior: 'smooth' });
}

onMounted(() => {
	updateScrollState();
	if (typeof ResizeObserver !== 'undefined' && scrollerRef.value) {
		resizeObserver = new ResizeObserver(() => updateScrollState());
		resizeObserver.observe(scrollerRef.value);
	}
});

onBeforeUnmount(() => {
	if (resizeObserver) {
		resizeObserver.disconnect();
		resizeObserver = null;
	}
});
</script>

<template>
	<section v-if="shouldRender" class="content-row" :aria-label="title">
		<header class="content-row__header">
			<div class="content-row__head-left">
				<span class="content-row__index" v-if="index">{{ index }}</span>
				<h2 class="t-h2 content-row__title">
					{{ title }}
				</h2>
			</div>
			<NuxtLink v-if="viewAllHref" :to="viewAllHref" class="content-row__link"> View all </NuxtLink>
		</header>

		<div class="content-row__viewport">
			<button v-if="canScrollLeft" type="button" class="content-row__nav content-row__nav--prev" aria-label="Scroll left" @click="scrollBy(-1)">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path fill="none" stroke="currentColor" stroke-width="1.25" d="m14 6-6 6 6 6" />
				</svg>
			</button>

			<ul ref="scrollerRef" class="content-row__scroller scroll-row" @scroll.passive="onScroll">
				<li v-for="item in items" :key="keyFor(item)" class="content-row__item">
					<slot :item="item" />
				</li>
				<slot v-if="$slots.append" name="append" />
			</ul>

			<button v-if="canScrollRight" type="button" class="content-row__nav content-row__nav--next" aria-label="Scroll right" @click="scrollBy(1)">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path fill="none" stroke="currentColor" stroke-width="1.25" d="m9 6 6 6-6 6" />
				</svg>
			</button>
		</div>
	</section>
</template>

<style scoped>
.content-row {
	position: relative;
	margin: 0 0 40px;
	padding: 0 4vw;
}

.content-row__header {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 16px;
	padding-bottom: 10px;
	border-bottom: 1px solid var(--color-line);
}

.content-row__head-left {
	display: flex;
	align-items: baseline;
	gap: 14px;
}

.content-row__index {
	font-family: var(--font-mono);
	font-size: 0.7rem;
	color: var(--color-brand);
	letter-spacing: 0.12em;
	font-feature-settings: 'tnum' 1;
}

.content-row__title {
	margin: 0;
}

.content-row__link {
	color: var(--color-surface-400);
	font-family: var(--font-sans);
	font-size: 0.75rem;
	font-weight: 500;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	text-decoration: none;
	transition: color 500ms ease;
}

.content-row__link:hover {
	color: var(--color-brand);
}

.content-row__viewport {
	position: relative;
}

.content-row__scroller {
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: minmax(140px, 1fr);
	gap: 18px;
	overflow-x: auto;
	padding: 4px 0 6px;
	list-style: none;
	margin: 0;
}

@media (min-width: 768px) {
	.content-row__scroller {
		grid-auto-columns: minmax(165px, 1fr);
	}
}

@media (min-width: 1280px) {
	.content-row__scroller {
		grid-auto-columns: minmax(180px, 1fr);
	}
}

.content-row__item {
	display: block;
	min-width: 0;
}

.content-row__nav {
	position: absolute;
	top: 4px;
	bottom: 4px;
	width: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(7, 7, 10, 0.85);
	border: 0;
	border-radius: 0;
	color: var(--color-surface-50);
	cursor: pointer;
	opacity: 0;
	transition:
		opacity 500ms ease,
		color 500ms ease;
	z-index: 2;
}

.content-row__nav--prev {
	left: 0;
}

.content-row__nav--next {
	right: 0;
}

.content-row__viewport:hover .content-row__nav,
.content-row__nav:focus-visible {
	opacity: 1;
}

.content-row__nav:hover {
	color: var(--color-brand);
}

.content-row__nav svg {
	width: 20px;
	height: 20px;
}
</style>
