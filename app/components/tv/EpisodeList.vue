<script setup>
import { stillImage } from '~/utils/tmdb.js';

defineProps({
	episodes: { type: Array, default: () => [] },
	loading: { type: Boolean, default: false },
	tvId: { type: [Number, String], default: null },
});

defineEmits(['play']);

function stillUrl(episode) {
	return stillImage(episode.still_path, 'w300');
}

function episodeKey(episode) {
	return `s${episode.season_number}e${episode.episode_number}`;
}

function formatNumber(value) {
	if (typeof value !== 'number') return '--';
	return String(value).padStart(2, '0');
}

function formatRatingDisplay(value) {
	const n = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(n) || n <= 0) return null;
	return n.toFixed(1);
}

function canWatchEpisode(episode) {
	return typeof episode.season_number === 'number' && typeof episode.episode_number === 'number';
}
</script>

<template>
	<div class="episodes">
		<div v-if="loading" class="episodes__skeleton">
			<div v-for="i in 4" :key="i" class="episodes__skeleton-row">
				<Skeleton width="160px" height="90px" rounded="none" />
				<div class="episodes__skeleton-body">
					<Skeleton width="40%" height="18px" rounded="none" />
					<Skeleton width="100%" height="12px" rounded="none" />
					<Skeleton width="80%" height="12px" rounded="none" />
				</div>
			</div>
		</div>

		<EmptyState icon="tv" v-else-if="episodes.length === 0" title="No episodes yet" message="Episode information is not available for this season." />

		<ul v-else class="episodes__list">
			<li v-for="episode in episodes" :key="episodeKey(episode)" class="episodes__item">
				<div class="episodes__still">
					<TmdbImage :src="stillUrl(episode)" :alt="episode.name || ''" ratio="16/9" rounded="none" />
				</div>
				<div class="episodes__body">
					<div class="episodes__meta">
						<span class="episodes__number">S{{ formatNumber(episode.season_number) }}E{{ formatNumber(episode.episode_number) }}</span>
						<span v-if="episode.runtime" class="episodes__runtime">{{ episode.runtime }}m</span>
						<span v-if="episode.air_date" class="episodes__date">{{ episode.air_date }}</span>
						<span v-if="episode.vote_average" class="episodes__rating">· {{ formatRatingDisplay(episode.vote_average) }}</span>
					</div>
					<h4 class="episodes__title">
						{{ episode.name || `Episode ${episode.episode_number}` }}
					</h4>
					<p v-if="episode.overview" class="episodes__overview">
						{{ episode.overview }}
					</p>
					<Button v-if="canWatchEpisode(episode)" variant="primary" size="sm" class="episodes__play" @click="$emit('play', episode)"> Play </Button>
				</div>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.episodes {
	display: flex;
	flex-direction: column;
	gap: 0;
	border-top: 1px solid var(--color-line);
}

.episodes__list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
}

.episodes__item {
	display: grid;
	grid-template-columns: 180px 1fr;
	gap: 18px;
	padding: 16px 0;
	border-bottom: 1px solid var(--color-line);
	transition: background-color 160ms ease;
}

.episodes__item:hover {
	background-color: rgba(240, 180, 41, 0.03);
}

@media (max-width: 640px) {
	.episodes__item {
		grid-template-columns: 1fr;
		gap: 12px;
	}
}

.episodes__still {
	width: 100%;
	max-width: 180px;
}

.episodes__body {
	display: flex;
	flex-direction: column;
	gap: 6px;
	min-width: 0;
}

.episodes__meta {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 4px 14px;
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.72rem;
	color: var(--color-surface-400);
	letter-spacing: 0.04em;
}

.episodes__number {
	font-weight: 500;
	color: var(--color-brand);
}

.episodes__runtime {
	color: var(--color-surface-200);
}

.episodes__date {
	color: var(--color-surface-400);
}

.episodes__rating {
	color: var(--color-brand);
}

.episodes__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.05rem;
	font-weight: 500;
	letter-spacing: 0;
	color: var(--color-surface-50);
	line-height: 1.25;
}

.episodes__overview {
	margin: 0;
	font-size: 0.88rem;
	color: var(--color-surface-200);
	line-height: 1.55;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.episodes__play {
	align-self: flex-start;
	margin-top: 6px;
}

.episodes__skeleton {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.episodes__skeleton-row {
	display: grid;
	grid-template-columns: 180px 1fr;
	gap: 18px;
	padding: 16px 0;
	border-bottom: 1px solid var(--color-line);
}

.episodes__skeleton-body {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

@media (max-width: 640px) {
	.episodes__skeleton-row {
		grid-template-columns: 1fr;
	}
}
</style>
