<script setup>
import { computed, ref } from 'vue';
import { buildVidfastTvUrl } from '~/utils/vidfast.js';
import { formatVoteCount, getYear } from '~/utils/format.js';

definePageMeta({
	name: 'watch-tv',
	layout: 'watch',
});

const route = useRoute();
const router = useRouter();
const tmdb = useTmdb();

const showId = computed(() => {
	const id = Number(route.params.id);
	return Number.isFinite(id) && id > 0 ? id : null;
});

const seasonNumber = computed(() => {
	const n = Number(route.params.season);
	return Number.isFinite(n) && n > 0 ? n : 1;
});

const episodeNumber = computed(() => {
	const n = Number(route.params.episode);
	return Number.isFinite(n) && n > 0 ? n : 1;
});

const show = ref(null);
const episodes = ref([]);
const error = ref(null);
const showSeasonList = ref(false);

const currentEpisode = computed(() => {
	if (!episodes.value.length) return null;
	return episodes.value.find((e) => typeof e.season_number === 'number' && typeof e.episode_number === 'number' && e.season_number === seasonNumber.value && e.episode_number === episodeNumber.value) || null;
});

const prevEpisode = computed(() => {
	const sorted = [...episodes.value].sort((a, b) => (a.episode_number ?? 0) - (b.episode_number ?? 0));
	const i = sorted.findIndex((e) => e.episode_number === episodeNumber.value);
	if (i > 0) return sorted[i - 1];
	return null;
});

const nextEpisode = computed(() => {
	const sorted = [...episodes.value].sort((a, b) => (a.episode_number ?? 0) - (b.episode_number ?? 0));
	const i = sorted.findIndex((e) => e.episode_number === episodeNumber.value);
	if (i >= 0 && i < sorted.length - 1) return sorted[i + 1];
	return null;
});

const playerSrc = computed(() => {
	if (!showId.value) return '';
	return buildVidfastTvUrl(showId.value, seasonNumber.value, episodeNumber.value, {
		autoPlay: true,
		nextButton: true,
		autoNext: true,
	});
});

async function loadShow() {
	if (!showId.value) {
		error.value = Object.assign(new Error('Invalid show id'), { status: 404 });
		return;
	}
	try {
		const data = await tmdb.tvDetails(showId.value);
		if (!data) {
			error.value = Object.assign(new Error('Show not found'), { status: 404 });
			return;
		}
		show.value = {
			id: data.id,
			title: data.name,
			overview: data.overview,
			rating: typeof data.vote_average === 'number' ? data.vote_average : null,
			voteCount: formatVoteCount(data.vote_count),
			year: getYear(data.first_air_date),
			numberOfSeasons: data.number_of_seasons,
			numberOfEpisodes: data.number_of_episodes,
			posterPath: data.poster_path || null,
			genres: Array.isArray(data.genres) ? data.genres : [],
		};
	} catch (err) {
		error.value = err;
	}
}

watch(
	show,
	(value) => {
		if (value?.title) useHead({ title: `${value.title}. Watch. ViewVerse` });
	},
	{ immediate: true },
);

async function loadSeason() {
	if (!showId.value) return;
	try {
		const data = await tmdb.tvSeason(showId.value, seasonNumber.value);
		episodes.value = Array.isArray(data?.episodes) ? data.episodes : [];
	} catch (err) {
		console.warn('[watch] season load failed', err);
		episodes.value = [];
	}
}

async function loadAll() {
	await Promise.all([loadShow(), loadSeason()]);
}

async function refresh() {
	error.value = null;
	show.value = null;
	episodes.value = [];
	await loadAll();
}

await loadAll();

function isCurrent(episode) {
	return episode.season_number === seasonNumber.value && episode.episode_number === episodeNumber.value;
}

function formatNumber(value) {
	if (typeof value !== 'number') return '--';
	return String(value).padStart(2, '0');
}

function goToEpisode(episode) {
	if (!episode || !showId.value) return;
	router.push(`/watch/tv/${showId.value}/${episode.season_number}/${episode.episode_number}`);
}

function goBack() {
	if (showId.value) {
		router.push(`/tv/${showId.value}`);
		return;
	}
	router.push('/');
}
</script>

<template>
	<WatchPage :title="show?.title" @back="goBack">
		<p v-if="currentEpisode" class="watch-page__episode">
			<span class="watch-page__episode-code">S{{ formatNumber(currentEpisode.season_number) }} E{{ formatNumber(currentEpisode.episode_number) }}</span>
			<span v-if="currentEpisode.name" class="watch-page__episode-name">{{ currentEpisode.name }}</span>
		</p>

		<ErrorState v-if="error" title="Unable to load the player" :message="error.message || 'Please try again.'" @retry="refresh" />

		<div v-else-if="!show" class="watch-page__loading">
			<Skeleton height="56.25vw" rounded="none" />
		</div>

		<div v-else class="watch-page__content">
			<VideoPlayer :src="playerSrc" />

			<section class="watch-page__info">
				<div class="watch-page__info-grid">
					<div class="watch-page__primary">
						<div class="watch-page__meta">
							<span v-if="show.rating !== null" class="watch-page__meta-chip watch-page__meta-chip--rating">
								<Rating :value="show.rating" />
							</span>
							<MetaChip v-if="show.year" :label="show.year" class="watch-page__meta-chip--year" />
							<MetaChip v-if="show.numberOfSeasons" :label="`${show.numberOfSeasons} season${show.numberOfSeasons === 1 ? '' : 's'}`" />
							<MetaChip v-if="show.numberOfEpisodes" :label="`${show.numberOfEpisodes} eps`" />
						</div>

						<p v-if="currentEpisode && currentEpisode.overview" class="watch-page__overview">
							{{ currentEpisode.overview }}
						</p>
					</div>

					<aside class="watch-page__actions" aria-label="Save">
						<WhitelistButton :id="show.id" media-type="tv" :title="show.title" :poster-path="show.posterPath" size="md" variant="secondary" />
					</aside>
				</div>

				<nav class="watch-page__nav" aria-label="Episode navigation">
					<Button variant="secondary" size="md" :disabled="!prevEpisode" @click="goToEpisode(prevEpisode)">
						<svg viewBox="0 0 24 24" aria-hidden="true" class="watch-page__nav-icon">
							<path fill="none" stroke="currentColor" stroke-width="1.25" d="m14 7-5 5 5 5" />
						</svg>
						Previous
					</Button>
					<Button variant="primary" size="md" :disabled="!nextEpisode" @click="goToEpisode(nextEpisode)">
						Next
						<svg viewBox="0 0 24 24" aria-hidden="true" class="watch-page__nav-icon">
							<path fill="none" stroke="currentColor" stroke-width="1.25" d="m10 7 5 5-5 5" />
						</svg>
					</Button>
				</nav>

				<details v-if="episodes.length > 0" class="watch-page__season">
					<summary class="watch-page__season-toggle">
						<span>{{ showSeasonList ? 'Hide' : 'Show' }} season {{ seasonNumber }} episodes</span>
						<svg viewBox="0 0 24 24" aria-hidden="true" class="watch-page__season-caret" :class="{ 'is-open': showSeasonList }">
							<path fill="none" stroke="currentColor" stroke-width="1.25" d="m6 9 6 6 6-6" />
						</svg>
					</summary>
					<ul v-if="showSeasonList" class="watch-page__episode-list">
						<li v-for="episode in episodes" :key="`s${episode.season_number}e${episode.episode_number}`" class="watch-page__episode-item" :class="{ 'is-current': isCurrent(episode) }">
							<button type="button" class="watch-page__episode-button" @click="goToEpisode(episode)">
								<span class="watch-page__episode-number">E{{ formatNumber(episode.episode_number) }}</span>
								<span class="watch-page__episode-name">{{ episode.name || `Episode ${episode.episode_number}` }}</span>
								<span v-if="episode.runtime" class="watch-page__episode-runtime">{{ episode.runtime }}m</span>
							</button>
						</li>
					</ul>
				</details>
			</section>
		</div>
	</WatchPage>
</template>

<style scoped>
.watch-page__episode {
	margin: 0;
	display: inline-flex;
	align-items: baseline;
	flex-wrap: wrap;
	gap: 10px;
	color: var(--color-surface-400);
	font-size: 0.95rem;
}

.watch-page__episode-code {
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.85rem;
	letter-spacing: 0.06em;
	color: var(--color-surface-200);
}

.watch-page__episode-name {
	font-family: var(--font-display);
	font-size: 1.05rem;
	font-weight: 500;
	color: var(--color-surface-50);
}

.watch-page__loading {
	max-width: var(--layout-max);
	margin: 0 auto;
}

.watch-page__content {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.watch-page__info {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.watch-page__info-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 20px;
}

@media (min-width: 768px) {
	.watch-page__info-grid {
		grid-template-columns: 1fr auto;
		gap: 32px;
		align-items: start;
	}
}

.watch-page__primary {
	display: flex;
	flex-direction: column;
	gap: 12px;
	min-width: 0;
}

.watch-page__meta {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 10px;
}

.watch-page__meta-chip--year {
	color: var(--color-surface-50);
}

.watch-page__meta-chip--rating {
	border-color: var(--color-brand);
}

.watch-page__overview {
	margin: 0;
	color: var(--color-surface-200);
	font-size: 0.98rem;
	line-height: 1.65;
	max-width: 64ch;
}

.watch-page__actions {
	display: flex;
	gap: 10px;
}

@media (min-width: 768px) {
	.watch-page__actions {
		flex-direction: column;
		align-items: flex-end;
	}
}

.watch-page__nav {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.watch-page__nav-icon {
	width: 14px;
	height: 14px;
}

.watch-page__season {
	display: block;
	border-top: 1px solid var(--color-line);
	padding-top: 16px;
}

.watch-page__season-toggle {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	padding: 0;
	color: var(--color-surface-200);
	font-family: var(--font-mono);
	font-size: 0.78rem;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	cursor: pointer;
	list-style: none;
	transition: color 160ms ease;
}

.watch-page__season-toggle::-webkit-details-marker {
	display: none;
}

.watch-page__season-toggle:hover {
	color: var(--color-brand);
}

.watch-page__season-caret {
	width: 14px;
	height: 14px;
	transition: transform 200ms ease;
}

.watch-page__season-caret.is-open {
	transform: rotate(180deg);
}

.watch-page__episode-list {
	list-style: none;
	margin: 14px 0 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 0;
	max-height: 360px;
	overflow-y: auto;
	border-top: 1px solid var(--color-line);
	border-bottom: 1px solid var(--color-line);
}

.watch-page__episode-item {
	border-bottom: 1px solid var(--color-line);
}

.watch-page__episode-item:last-of-type {
	border-bottom: 0;
}

.watch-page__episode-button {
	display: grid;
	grid-template-columns: 56px 1fr auto;
	align-items: center;
	gap: 12px;
	padding: 12px 4px;
	background-color: transparent;
	border: 0;
	color: var(--color-surface-50);
	text-align: left;
	width: 100%;
	cursor: pointer;
	transition: color 160ms ease;
}

.watch-page__episode-button:hover {
	color: var(--color-brand);
}

.watch-page__episode-item.is-current .watch-page__episode-button {
	color: var(--color-brand);
}

.watch-page__episode-number {
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.78rem;
	color: var(--color-surface-400);
	letter-spacing: 0.04em;
}

.watch-page__episode-item.is-current .watch-page__episode-number {
	color: var(--color-brand);
}

.watch-page__episode-name {
	font-family: var(--font-sans);
	font-size: 0.92rem;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.watch-page__episode-runtime {
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.72rem;
	color: var(--color-surface-400);
	letter-spacing: 0.04em;
}
</style>
