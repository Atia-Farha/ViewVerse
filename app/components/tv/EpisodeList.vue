<script setup>
import { stillImage } from '~/utils/tmdb.js';

const props = defineProps({
	episodes: { type: Array, default: () => [] },
	loading: { type: Boolean, default: false },
	tvId: { type: [Number, String], default: null },
});

// Kept for forward compatibility — page-level handlers can still react to play.
defineEmits(['play']);

function stillUrl(episode) {
	return stillImage(episode.still_path, 'w300');
}

function episodeKey(episode) {
	return `s${episode.season_number}e${episode.episode_number}`;
}

function episodePath(episode) {
	if (!props.tvId) return '#';
	if (typeof episode.season_number !== 'number' || typeof episode.episode_number !== 'number') return '#';
	return `/watch/tv/${props.tvId}/${episode.season_number}/${episode.episode_number}`;
}

function pad2(value) {
	return typeof value === 'number' ? String(value).padStart(2, '0') : '--';
}

function formatRuntime(value) {
	return typeof value === 'number' && value > 0 ? `${value}m` : null;
}

function formatRatingDisplay(value) {
	const n = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(n) || n <= 0) return null;
	return n.toFixed(1);
}

function episodeTitle(episode) {
	return episode.name && episode.name.trim().length > 0 ? episode.name : `Episode ${episode.episode_number ?? '?'}`;
}

function canWatchEpisode(episode) {
	return Boolean(props.tvId) && typeof episode?.season_number === 'number' && typeof episode?.episode_number === 'number';
}
</script>

<template>
	<div class="episodes">
		<div v-if="loading" class="episodes__skeleton" aria-hidden="true">
			<div v-for="i in 4" :key="i" class="episodes__skeleton-row">
				<Skeleton width="180px" height="100px" rounded="none" />
				<div class="episodes__skeleton-body">
					<Skeleton width="40%" height="18px" rounded="none" />
					<Skeleton width="100%" height="12px" rounded="none" />
					<Skeleton width="80%" height="12px" rounded="none" />
				</div>
			</div>
		</div>

		<EmptyState v-else-if="episodes.length === 0" icon="tv" title="No episodes for this season" message="Episode information isn't available — try selecting another season." />

		<ul v-else class="episodes__list">
			<li v-for="episode in episodes" :key="episodeKey(episode)" class="episodes__item" :class="{ 'episodes__item--linked': canWatchEpisode(episode) }">
				<NuxtLink v-if="canWatchEpisode(episode)" :to="episodePath(episode)" class="episodes__link" :aria-label="`Play ${episodeTitle(episode)}`">
					<div class="episodes__still">
						<TmdbImage :src="stillUrl(episode)" :alt="episodeTitle(episode)" ratio="16/9" rounded="none" />
					</div>

					<div class="episodes__number" aria-hidden="true">
						<span class="episodes__number-main">{{ pad2(episode.episode_number) }}</span>
						<span class="episodes__number-sub">E{{ pad2(episode.episode_number) }}</span>
					</div>

					<div class="episodes__body">
						<div class="episodes__head">
							<h4 class="episodes__title">{{ episodeTitle(episode) }}</h4>
							<div class="episodes__meta">
								<span v-if="formatRuntime(episode.runtime)" class="episodes__runtime">
									{{ formatRuntime(episode.runtime) }}
								</span>
								<span v-if="episode.air_date" class="episodes__date">{{ episode.air_date }}</span>
								<span v-if="formatRatingDisplay(episode.vote_average)" class="episodes__rating"> ★ {{ formatRatingDisplay(episode.vote_average) }} </span>
							</div>
						</div>

						<p v-if="episode.overview" class="episodes__overview">{{ episode.overview }}</p>
					</div>

					<div class="episodes__play" aria-hidden="true">
						<svg viewBox="0 0 24 24" class="episodes__play-icon">
							<path fill="currentColor" d="M8 5v14l11-7z" />
						</svg>
					</div>
				</NuxtLink>

				<div v-else class="episodes__link episodes__link--disabled">
					<div class="episodes__still">
						<TmdbImage :src="stillUrl(episode)" :alt="episodeTitle(episode)" ratio="16/9" rounded="none" />
					</div>
					<div class="episodes__number">
						<span class="episodes__number-main">{{ pad2(episode.episode_number) }}</span>
					</div>
					<div class="episodes__body">
						<h4 class="episodes__title">{{ episodeTitle(episode) }}</h4>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.episodes {
	display: flex;
	flex-direction: column;
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
	border-bottom: 1px solid var(--color-line);
	transition: background-color 500ms ease;
}

/* The whole row is the target. Padding lives on the link so the click area stays big. */
.episodes__link {
	display: grid;
	grid-template-columns: minmax(140px, 22%) auto 1fr auto;
	gap: 18px;
	align-items: center;
	padding: 16px 4vw;
	color: inherit;
	text-decoration: none;
	transition:
		background-color 500ms ease,
		color 500ms ease;
}

.episodes__link:hover {
	background-color: rgba(240, 180, 41, 0.04);
	color: var(--color-brand);
}

.episodes__link--disabled {
	pointer-events: none;
	opacity: 0.7;
	cursor: default;
}

.episodes__still {
	width: 100%;
	max-width: 220px;
	aspect-ratio: 16 / 9;
	overflow: hidden;
}

/* Stacked episode number — large monospace digits on top, "Exx" caption beneath,
   with a thin vertical accent separating the number from the title. */
.episodes__number {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 2px;
	padding-right: 18px;
	border-right: 1px solid var(--color-line);
	min-width: 64px;
}

.episodes__number-main {
	font-family: var(--font-display);
	font-feature-settings: 'tnum' 1;
	font-size: clamp(1.4rem, 2vw, 1.8rem);
	font-weight: 500;
	line-height: 1;
	color: var(--color-brand);
	letter-spacing: 0.02em;
}

.episodes__number-sub {
	font-family: var(--font-mono);
	font-size: 0.7rem;
	letter-spacing: 0.08em;
	color: var(--color-surface-400);
	text-transform: uppercase;
}

.episodes__body {
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.episodes__head {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 8px 16px;
}

.episodes__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.05rem;
	font-weight: 500;
	color: inherit;
	line-height: 1.3;
	flex: 1 1 auto;
	min-width: 0;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.episodes__meta {
	display: inline-flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 10px;
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.75rem;
	color: var(--color-surface-400);
	letter-spacing: 0.04em;
}

.episodes__rating {
	color: var(--color-rating);
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

/* Hover-revealed play indicator: hidden + offset until the row is hovered. */
.episodes__play {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border: 1px solid var(--color-brand);
	border-radius: 9999px;
	color: var(--color-brand);
	opacity: 0;
	transform: translateX(8px);
	transition:
		opacity 500ms ease,
		transform 500ms ease;
}

.episodes__link:hover .episodes__play {
	opacity: 1;
	transform: translateX(0);
}

.episodes__link:focus-visible .episodes__play {
	opacity: 1;
	transform: translateX(0);
}

.episodes__play-icon {
	width: 18px;
	height: 18px;
}

/* Layout: stack the number/title on narrow screens so the still keeps a good size. */
@media (max-width: 720px) {
	.episodes__link {
		grid-template-columns: minmax(110px, 35%) 1fr auto;
		gap: 12px;
		padding: 14px 4vw;
	}

	.episodes__number {
		min-width: 48px;
		padding-right: 12px;
	}

	.episodes__number-sub {
		display: none;
	}

	.episodes__play {
		width: 32px;
		height: 32px;
	}
}

@media (max-width: 480px) {
	.episodes__link {
		grid-template-columns: 1fr;
		gap: 10px;
	}

	.episodes__number {
		border-right: 0;
		padding-right: 0;
		flex-direction: row;
		align-items: baseline;
		gap: 6px;
	}

	.episodes__play {
		display: none;
	}
}

/* Skeleton rows echo the same grid so there's no jump when content swaps in. */
.episodes__skeleton {
	display: flex;
	flex-direction: column;
}

.episodes__skeleton-row {
	display: grid;
	grid-template-columns: 180px 1fr;
	gap: 18px;
	padding: 16px 4vw;
	border-bottom: 1px solid var(--color-line);
}

.episodes__skeleton-body {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

@media (max-width: 720px) {
	.episodes__skeleton-row {
		grid-template-columns: 110px 1fr;
		gap: 12px;
		padding: 14px 4vw;
	}
}
</style>
