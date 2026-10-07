<script setup>
import { computed } from 'vue';
import { backdropLarge } from '~/utils/tmdb.js';

const props = defineProps({
	item: { type: Object, default: null },
});

const emit = defineEmits(['play']);

const backdropStyle = computed(() => {
	const url = backdropLarge(props.item?.backdropPath);
	if (!url) return {};
	return { backgroundImage: `url(${url})` };
});

function formatRatingDisplay(value) {
	const n = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(n) || n <= 0) return null;
	return n.toFixed(1);
}

function onPlay() {
	if (!props.item) return;
	emit('play', props.item);
}
</script>

<template>
	<section v-if="item" class="hero">
		<div class="hero__backdrop" :style="backdropStyle">
			<div class="hero__gradient hero__gradient--bottom" />
			<div class="hero__gradient hero__gradient--side" />
		</div>

		<div class="hero__content">
			<h1 class="hero__title">
				{{ item.title }}
			</h1>
			<div class="hero__meta">
				<span v-if="item.rating !== null && item.rating !== undefined" class="hero__rating">
					<span class="hero__rating-prefix">·</span>
					<span class="hero__rating-value">{{ formatRatingDisplay(item.rating) }}</span>
				</span>
				<span v-if="item.year" class="hero__year">{{ item.year }}</span>
				<span v-if="item.runtime" class="hero__runtime">{{ item.runtime }}</span>
				<span v-if="item.genres && item.genres.length" class="hero__genres">
					{{ item.genres.slice(0, 3).join(' / ') }}
				</span>
			</div>
			<p v-if="item.overview" class="hero__overview">
				{{ item.overview }}
			</p>
			<div class="hero__actions">
				<Button variant="primary" size="xl" @click="onPlay">
					<svg viewBox="0 0 24 24" aria-hidden="true" class="hero__play-icon">
						<path fill="currentColor" d="M8 5v14l11-7z" />
					</svg>
					<span>Play</span>
				</Button>
				<WhitelistButton :id="item.id" :media-type="item.mediaType" :title="item.title" :poster-path="item.posterPath" size="xl" />
			</div>
		</div>
	</section>
</template>

<style scoped>
.hero {
	position: relative;
	width: 100%;
	min-height: 78vh;
	max-height: 880px;
	display: flex;
	align-items: flex-end;
	color: #fff;
	overflow: hidden;
	isolation: isolate;
}

.hero__backdrop {
	position: absolute;
	inset: 0;
	background-color: var(--color-bg-elevated);
	background-size: cover;
	background-position: center top;
	background-repeat: no-repeat;
	z-index: -1;
}

.hero__gradient {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.hero__gradient--bottom {
	background: linear-gradient(to top, var(--color-bg) 4%, rgba(7, 7, 10, 0.85) 22%, rgba(7, 7, 10, 0.4) 55%, rgba(7, 7, 10, 0.1) 85%, transparent 100%);
}

.hero__gradient--side {
	background: linear-gradient(to right, var(--color-bg) 0%, rgba(7, 7, 10, 0.85) 30%, rgba(7, 7, 10, 0.4) 55%, transparent 80%);
}

.hero__content {
	position: relative;
	width: 100%;
	padding: 0 4vw 64px;
	max-width: 760px;
	display: flex;
	flex-direction: column;
	gap: 14px;
}

@media (min-width: 1024px) {
	.hero__content {
		padding-bottom: 104px;
	}
}

.hero__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(2.2rem, 6vw, 4.4rem);
	font-weight: 500;
	line-height: 1.05;
	letter-spacing: -0.01em;
	color: var(--color-surface-50);
	text-wrap: balance;
}

.hero__meta {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 6px 18px;
	margin-top: 4px;
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.8rem;
	letter-spacing: 0.04em;
	color: var(--color-surface-400);
}

.hero__rating {
	display: inline-flex;
	align-items: baseline;
	gap: 4px;
	color: var(--color-brand);
}

.hero__rating-prefix {
	opacity: 0.6;
}

.hero__rating-value {
	font-weight: 500;
}

.hero__year,
.hero__runtime {
	color: var(--color-surface-200);
}

.hero__genres {
	color: var(--color-surface-400);
}

.hero__overview {
	margin: 8px 0 0;
	font-size: 1rem;
	line-height: 1.55;
	color: var(--color-surface-200);
	max-width: 60ch;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

@media (min-width: 1024px) {
	.hero__overview {
		font-size: 1.05rem;
		-webkit-line-clamp: 4;
	}
}

.hero__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin-top: 16px;
}

.hero__play-icon {
	width: 22px;
	height: 22px;
}
</style>
