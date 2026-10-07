<script setup>
import { h, ref } from 'vue';

const tmdb = useTmdb();
const genres = ref([]);
const loading = ref(true);

async function load() {
	loading.value = true;
	try {
		const [movies, tv] = await Promise.all([tmdb.genresMovie(), tmdb.genresTv()]);
		const map = new Map();
		for (const list of [movies?.genres || [], tv?.genres || []]) {
			for (const g of list) {
				if (!map.has(g.id)) map.set(g.id, g);
			}
		}
		genres.value = [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
	} catch (err) {
		console.warn('[genres] load failed', err);
		genres.value = [];
	} finally {
		loading.value = false;
	}
}

const STROKE = {
	fill: 'none',
	stroke: 'currentColor',
	'stroke-width': '1.5',
	'stroke-linecap': 'round',
	'stroke-linejoin': 'round',
};
const FILLED = { fill: 'currentColor', stroke: 'none' };
const dot = (cx, cy, r = 0.9) => h('circle', { cx, cy, r, ...FILLED });

function iconFor(id) {
	if (id === 28) {
		return () => h('g', STROKE, [h('path', { d: 'M13 2 L4 14h6l-1 8L20 10h-6z' }), h('path', { d: 'M3 6l2-1M21 18l-2 1' })]);
	}

	if (id === 12) {
		return () => h('g', STROKE, [h('path', { d: 'M3 20l5-9 4 5 3-4 6 4' }), h('path', { d: 'M3 20h18' }), dot(12, 11)]);
	}

	if (id === 16) {
		return () => h('g', STROKE, [h('rect', { x: 3, y: 6, width: 18, height: 12, rx: 0.5 }), h('path', { d: 'M3 10h3M3 14h3M18 10h3M18 14h3' }), h('path', { d: 'M9 6v12M15 6v12' })]);
	}

	if (id === 35) {
		return () => h('g', STROKE, [h('path', { d: 'M4 4h8v9a4 4 0 0 1-8 0z' }), dot(6.5, 9.5, 0.8), dot(9.5, 9.5, 0.8), h('path', { d: 'M6 13c.8 1 1.6 1.4 2 1.4 1.4 0 1.2-1.4 2-1.4' }), h('path', { d: 'M14 4h6v9a3 3 0 0 1-6 0z' }), h('path', { d: 'M16 7.5l.8 1.6 1.7.2-1.3 1.1.4 1.7-1.6-.9-1.6.9.4-1.7-1.3-1.1 1.7-.2z', ...FILLED })]);
	}

	if (id === 80) {
		return () => h('g', STROKE, [h('circle', { cx: 7.5, cy: 14.5, r: 3.5 }), h('circle', { cx: 16.5, cy: 14.5, r: 3.5 }), h('path', { d: 'M9.5 11L12 8.5M14.5 11L17 8.5' }), h('path', { d: 'M11 14.5h2' })]);
	}

	if (id === 99) {
		return () => h('g', STROKE, [h('rect', { x: 3, y: 8, width: 18, height: 13, rx: 0.5 }), h('path', { d: 'M3 8l3-4h3l-3 4zM9 4l3 4M12 8l3-4h3l-3 4z' })]);
	}

	if (id === 18) {
		return () => h('g', STROKE, [h('path', { d: 'M3 5h8v10a4 4 0 0 1-8 0z' }), dot(5.6, 9, 0.8), dot(8.4, 9, 0.8), h('path', { d: 'M5 12.5c.6.8 1.4 1.2 2 1.2s1.4-.4 2-1.2' }), h('path', { d: 'M13 5h8v9a2 2 0 0 1-4 0V5z' }), h('path', { d: 'M15.2 8.6l.8 1.4 1.6.2-1.2 1 .3 1.6-1.5-.8-1.5.8.3-1.6-1.2-1 1.6-.2z', ...FILLED })]);
	}

	if (id === 10751) {
		return () => h('g', STROKE, [h('path', { d: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z' }), h('path', { d: 'M10.5 15.5c0-1.2.9-2 1.5-2s1.5.8 1.5 2-1.3 2.5-1.5 3c-.2-.5-1.5-1.5-1.5-3z' })]);
	}

	if (id === 14) {
		return () => h('g', STROKE, [h('path', { d: 'M5 20h14L12 3z' }), h('path', { d: 'M8.5 14h7' }), h('path', { d: 'M18 7.5l.8 1.6 1.7.2-1.3 1.1.4 1.7-1.6-.9-1.6.9.4-1.7-1.3-1.1 1.7-.2z', ...FILLED })]);
	}

	if (id === 36) {
		return () => h('g', STROKE, [h('path', { d: 'M6 3h12v18l-3-2-3 2-3-2-3 2z' }), h('path', { d: 'M9 8h6M9 12h6M9 16h4' })]);
	}

	if (id === 27) {
		return () => h('g', STROKE, [h('path', { d: 'M5 11a7 7 0 0 1 14 0v4l-2 1v2l-2-1-2 1-2-1-2 1-2-1v-2l-2-1z' }), dot(9, 11, 1.2), dot(15, 11, 1.2), h('path', { d: 'M10 16l1 1.5 1-1.5M12 17.5l1 1.5 1-1.5' })]);
	}

	if (id === 10402) {
		return () => h('g', STROKE, [h('path', { d: 'M9 18V5l11-2v13' }), h('path', { d: 'M20 3v2' }), h('circle', { cx: 6, cy: 18, r: 3 }), h('circle', { cx: 17, cy: 16, r: 3 })]);
	}

	if (id === 9648) {
		return () => h('g', STROKE, [h('circle', { cx: 10, cy: 10, r: 6 }), h('path', { d: 'M14.5 14.5L20 20' }), h('path', { d: 'M10 7.5c1.4 0 2.5 1 2.5 2.3 0 .9-.5 1.4-1.2 1.8-.6.3-1.3.7-1.3 1.6' }), dot(10, 14.6, 0.7)]);
	}

	if (id === 10749) {
		return () => h('g', STROKE, [h('path', { d: 'M12 20.5S5 16.5 5 10.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5c0 6-7 10-7 10z' }), h('path', { d: 'M14 14l7-7' }), h('path', { d: 'M19 5l2 2M21 7l-2-2' })]);
	}

	if (id === 878) {
		return () => h('g', STROKE, [h('path', { d: 'M12 3c3.5 3 5 7 5 11H7c0-4 1.5-8 5-11z' }), h('circle', { cx: 12, cy: 10, r: 1.5 }), h('path', { d: 'M7 14l-3 5M17 14l3 5' }), h('path', { d: 'M10 19l-1 2M14 19l1 2' })]);
	}

	if (id === 10770) {
		return () => h('g', STROKE, [h('rect', { x: 3, y: 6, width: 18, height: 13, rx: 1 }), h('path', { d: 'M9 22h6M12 19v3' }), h('path', { d: 'M8 6V3.5M16 6V3.5' }), dot(9, 12.5, 0.9), dot(15, 12.5, 0.9), h('path', { d: 'M10 16h4' })]);
	}

	if (id === 53) {
		return () => h('g', STROKE, [h('path', { d: 'M12 2v8' }), h('path', { d: 'M8 10h8l-1 11H9z' }), h('path', { d: 'M9 14h6' })]);
	}

	if (id === 10752) {
		return () => h('g', STROKE, [h('rect', { x: 3, y: 11, width: 14, height: 6, rx: 0.5 }), h('rect', { x: 6, y: 7, width: 10, height: 4, rx: 0.3 }), h('path', { d: 'M16 9h4l1 2-2 2h-3' }), h('circle', { cx: 7, cy: 19, r: 1.6 }), h('circle', { cx: 13, cy: 19, r: 1.6 }), dot(7, 19, 0.5), dot(13, 19, 0.5), h('path', { d: 'M5 14h10' })]);
	}

	if (id === 37) {
		return () => h('g', STROKE, [h('path', { d: 'M3 16c2 2 5 2 9 2s7 0 9-2c-1-3-3-5-9-5s-8 2-9 5z' }), h('path', { d: 'M7 13c0-3 2-6 5-6s5 3 5 6' }), h('path', { d: 'M11 8l1-1M13 8l-1-1' })]);
	}

	if (id === 10759) {
		return () => h('g', STROKE, [h('path', { d: 'M12 3l8 3v6c0 5-4 8.5-8 9.5-4-1-8-4.5-8-9.5V6z' }), h('path', { d: 'M12 8.5l1.5 3 3.2.4-2.4 2.2.6 3.2-2.9-1.6-2.9 1.6.6-3.2-2.4-2.2 3.2-.4z' })]);
	}

	if (id === 10762) {
		return () => h('g', STROKE, [h('path', { d: 'M8 10a4 4 0 1 1 8 0c0 3-2 5-4 5s-4-2-4-5z' }), h('path', { d: 'M11 15.5l1 .5 1-.5' }), h('path', { d: 'M12 16v5' }), h('path', { d: 'M10 21h4' })]);
	}

	if (id === 10763) {
		return () => h('g', STROKE, [h('rect', { x: 9, y: 3, width: 6, height: 11, rx: 3 }), h('path', { d: 'M6 11a6 6 0 0 0 12 0' }), h('path', { d: 'M12 17v4' }), h('path', { d: 'M9 21h6' }), h('path', { d: 'M10.5 6.5h3M10.5 9.5h3' })]);
	}

	if (id === 10764) {
		return () => h('g', STROKE, [h('rect', { x: 3, y: 6, width: 18, height: 13, rx: 0.5 }), h('path', { d: 'M3 6l4-3 4 1-4 3zM11 4l4 1-4 3zM15 4l3-1 3 3-3 0z' }), h('path', { d: 'M10 11l5 3-5 3z', ...FILLED })]);
	}

	if (id === 10765) {
		return () => h('g', STROKE, [h('circle', { cx: 12, cy: 12, r: 5.5 }), h('ellipse', { cx: 12, cy: 13, rx: 9.5, ry: 2 }), h('path', { d: 'M9.5 11c-.4.6-.6 1.3-.6 2' })]);
	}

	if (id === 10766) {
		return () => h('g', STROKE, [h('path', { d: 'M5 4h14v16H5z' }), h('path', { d: 'M9 4v16M15 4v16M5 8h14M5 16h14' }), h('path', { d: 'M12 9.5l1.5 1.5L12 12l-1.5-1z' }), h('path', { d: 'M12 9.5L13.5 11 12 12.5 10.5 11z' })]);
	}

	if (id === 10767) {
		return () => h('g', STROKE, [h('path', { d: 'M3 5h12v8H8l-5 4z' }), dot(7, 9, 0.7), dot(11, 9, 0.7), h('path', { d: 'M9 13v2h8l4 4v-9h-5' }), dot(14, 13.5, 0.6), dot(16.5, 13.5, 0.6), dot(19, 13.5, 0.6)]);
	}

	if (id === 10768) {
		return () => h('g', STROKE, [h('path', { d: 'M5 3v18' }), h('path', { d: 'M5 4h10l-2 4 2 4H5z' }), h('path', { d: 'M19 5v16' }), h('path', { d: 'M19 6h-7l1.5 3-1.5 3h7z' })]);
	}

	return () => h('g', STROKE, [h('rect', { x: 4, y: 4, width: 16, height: 16 }), h('path', { d: 'M4 9h16M4 15h16M8 4v16M16 4v16' })]);
}

await load();
</script>

<template>
	<section class="genres-list" aria-label="Genres">
		<header class="genres-list__header">
			<h2 class="t-h2 genres-list__title">Browse by Genre</h2>
			<span class="genres-list__count">{{ genres.length }}</span>
		</header>

		<div v-if="loading" class="genres-list__skeletons" aria-hidden="true">
			<div v-for="i in 9" :key="i" class="genres-list__skeleton" />
		</div>

		<ul v-else-if="genres.length > 0" class="genres-list__grid">
			<li v-for="g in genres" :key="g.id" class="genres-list__item-wrap">
				<NuxtLink :to="`/genre/${g.id}`" class="genres-list__item">
					<span class="genres-list__corner" aria-hidden="true">
						<svg viewBox="0 0 24 24" class="genres-list__glyph">
							<component :is="iconFor(g.id)" />
						</svg>
					</span>
					<span class="genres-list__body-inner">
						<span class="genres-list__name">{{ g.name }}</span>
					</span>
				</NuxtLink>
			</li>
		</ul>

		<p v-else class="genres-list__empty">No genres available.</p>
	</section>
</template>

<style scoped>
.genres-list {
	padding: 24px 4vw 64px;
}

.genres-list__header {
	display: flex;
	align-items: baseline;
	gap: 14px;
	margin-bottom: 18px;
	padding-bottom: 10px;
	border-bottom: 1px solid var(--color-line);
}

.genres-list__title {
	margin: 0;
}

.genres-list__count {
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.7rem;
	color: var(--color-surface-500);
	letter-spacing: 0.06em;
}

.genres-list__grid {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	gap: 14px;
}

@media (min-width: 640px) {
	.genres-list__grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 1024px) {
	.genres-list__grid {
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
	}
}

@media (min-width: 1280px) {
	.genres-list__grid {
		grid-template-columns: repeat(4, 1fr);
	}
}

.genres-list__item-wrap {
	list-style: none;
}

.genres-list__item {
	position: relative;
	display: block;
	overflow: hidden;
	min-height: 132px;
	padding: 18px 20px 18px 22px;
	background-color: var(--color-bg-elevated);
	border: 1px solid var(--color-line);
	border-radius: 0;
	color: var(--color-surface-200);
	text-decoration: none;
	transition:
		border-color 220ms ease,
		background-color 220ms ease,
		color 220ms ease;
}

.genres-list__corner {
	position: absolute;
	top: 50%;
	right: 14px;
	width: 56px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--color-surface-700);
	pointer-events: none;
	transform: translateY(-50%) scale(1);
	transform-origin: center;
	transition:
		color 260ms ease,
		transform 320ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.genres-list__glyph {
	width: 100%;
	height: 100%;
}

.genres-list__item:hover,
.genres-list__item:focus-visible {
	border-color: var(--color-brand);
	color: var(--color-surface-50);
	background-color: var(--color-bg-card);
}

.genres-list__item:hover .genres-list__corner,
.genres-list__item:focus-visible .genres-list__corner {
	color: var(--color-brand);
	transform: translateY(-50%) scale(2.4);
}

.genres-list__body-inner {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	height: 100%;
	min-height: 96px;
	max-width: calc(100% - 72px);
}

.genres-list__name {
	font-family: var(--font-sans);
	font-size: 1.35rem;
	font-weight: 600;
	letter-spacing: -0.01em;
	line-height: 1.1;
	text-transform: uppercase;
	min-width: 0;
	color: var(--color-surface-50);
}

.genres-list__skeletons {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	gap: 14px;
}

@media (min-width: 640px) {
	.genres-list__skeletons {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 1024px) {
	.genres-list__skeletons {
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
	}
}

@media (min-width: 1280px) {
	.genres-list__skeletons {
		grid-template-columns: repeat(4, 1fr);
	}
}

.genres-list__skeleton {
	height: 132px;
	background-color: var(--color-surface-800);
}

.genres-list__empty {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.78rem;
	color: var(--color-surface-500);
}
</style>
