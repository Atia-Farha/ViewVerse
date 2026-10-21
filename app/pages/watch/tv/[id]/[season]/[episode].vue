<script setup>
import { buildCinesrcTvUrl } from '~/utils/cinesrc.js';
import { buildVidfastTvUrl } from '~/utils/vidfast.js';
import { buildScreenscapeTvUrl } from '~/utils/screenscape.js';
import { formatVoteCount, getYear } from '~/utils/format.js';
import { shareHeadMeta } from '~/utils/share.js';
import { tmdbShareImage } from '~/utils/tmdb.js';

definePageMeta({
	name: 'watch-tv',
});

const route = useRoute();
const router = useRouter();
const tmdb = useTmdb();
const toast = useToast();

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
const seasonLoading = ref(false);
const seasonError = ref(false);
const adjacentLoading = ref({ prev: false, next: false });

const seasonEpisodesCache = reactive(new Map());

const currentEpisode = computed(() => {
	if (!episodes.value.length) return null;
	return episodes.value.find((e) => typeof e.season_number === 'number' && typeof e.episode_number === 'number' && e.season_number === seasonNumber.value && e.episode_number === episodeNumber.value) || null;
});

const sortedEpisodes = computed(() => [...episodes.value].sort((a, b) => (a.episode_number ?? 0) - (b.episode_number ?? 0)));

const playableSeasons = computed(() => {
	const seasons = show.value?.seasons ?? [];
	return seasons.filter((s) => typeof s.season_number === 'number' && s.season_number > 0).sort((a, b) => a.season_number - b.season_number);
});

const adjacentSeasonNumber = computed(() => {
	const seasons = playableSeasons.value.map((s) => s.season_number);
	const idx = seasons.indexOf(seasonNumber.value);
	return {
		prev: idx > 0 ? seasons[idx - 1] : null,
		next: idx >= 0 && idx < seasons.length - 1 ? seasons[idx + 1] : null,
	};
});

const prevEpisode = computed(() => {
	const sorted = sortedEpisodes.value;
	const i = sorted.findIndex((e) => e.episode_number === episodeNumber.value);
	return i > 0 ? sorted[i - 1] : null;
});

const nextEpisode = computed(() => {
	const sorted = sortedEpisodes.value;
	const i = sorted.findIndex((e) => e.episode_number === episodeNumber.value);
	return i >= 0 && i < sorted.length - 1 ? sorted[i + 1] : null;
});

async function ensureSeasonFetched(season) {
	if (typeof season !== 'number') return [];
	if (seasonEpisodesCache.has(season)) return seasonEpisodesCache.get(season);
	try {
		const data = await tmdb.tvSeason(showId.value, season);
		const list = Array.isArray(data?.episodes) ? data.episodes : [];
		seasonEpisodesCache.set(season, list);
		return list;
	} catch {
		return [];
	}
}

const prevEpisodeAcross = computed(() => {
	const within = prevEpisode.value;
	if (within) return { target: within, ready: true };
	const target = adjacentSeasonNumber.value.prev;
	if (!target) return { target: null, ready: true };
	const list = seasonEpisodesCache.get(target) || [];
	if (list.length) {
		const sorted = [...list].sort((a, b) => (a.episode_number ?? 0) - (b.episode_number ?? 0));
		return { target: { season_number: target, episode_number: sorted[sorted.length - 1].episode_number }, ready: true };
	}
	return { target: { season_number: target, episode_number: 1 }, ready: false };
});

const nextEpisodeAcross = computed(() => {
	const within = nextEpisode.value;
	if (within) return { target: within, ready: true };
	const target = adjacentSeasonNumber.value.next;
	if (!target) return { target: null, ready: true };
	const list = seasonEpisodesCache.get(target) || [];
	if (list.length) {
		const sorted = [...list].sort((a, b) => (a.episode_number ?? 0) - (b.episode_number ?? 0));
		return { target: { season_number: target, episode_number: sorted[0].episode_number }, ready: true };
	}
	return { target: { season_number: target, episode_number: 1 }, ready: false };
});

const playerSrc = computed(() => {
	if (!showId.value) return '';
	return buildCinesrcTvUrl(showId.value, seasonNumber.value, episodeNumber.value, {
		autoplay: true,
		autonext: true,
	});
});

const playerFallbackSrc = computed(() => {
	if (!showId.value) return '';
	return buildVidfastTvUrl(showId.value, seasonNumber.value, episodeNumber.value, {
		autoPlay: true,
		nextButton: true,
		autoNext: true,
	});
});

const playerScreenscapeSrc = computed(() => {
	if (!showId.value) return '';
	return buildScreenscapeTvUrl(showId.value, seasonNumber.value, episodeNumber.value);
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
			seasons: Array.isArray(data.seasons) ? data.seasons : [],
		};
	} catch (err) {
		error.value = err;
	}
}

watch(
	show,
	(value) => {
		if (!value?.title) return;
		const ep = `S${seasonNumber.value}E${episodeNumber.value}`;
		const description = value.overview || `Watch ${value.title} ${ep} on ViewVerse.`;
		const stillPath = currentEpisode.value?.still_path || value.posterPath;
		const image = tmdbShareImage(stillPath, 'w300');
		useHead({
			title: `${value.title} | ViewVerse`,
			meta: shareHeadMeta({
				title: `Watching ${value.title} ${ep} | ViewVerse`,
				description,
				path: `/watch/tv/${value.id}/${seasonNumber.value}/${episodeNumber.value}`,
				image,
				type: 'video.episode',
			}),
		});
	},
	{ immediate: true },
);

async function loadSeason() {
	if (!showId.value) return;
	seasonLoading.value = true;
	seasonError.value = false;
	try {
		const data = await tmdb.tvSeason(showId.value, seasonNumber.value);
		const list = Array.isArray(data?.episodes) ? data.episodes : [];
		episodes.value = list;
		seasonEpisodesCache.set(seasonNumber.value, list);
		if (list.length === 0) {
			seasonError.value = true;
		}
	} catch {
		episodes.value = [];
		seasonError.value = true;
		toast.error('Could not load episodes for this season.');
	} finally {
		seasonLoading.value = false;
	}
}

async function prefetchAdjacentSeasons() {
	const { prev, next } = adjacentSeasonNumber.value;
	const tasks = [];
	if (typeof prev === 'number') tasks.push(ensureSeasonFetched(prev));
	if (typeof next === 'number') tasks.push(ensureSeasonFetched(next));
	if (tasks.length) await Promise.all(tasks);
}

async function loadAll() {
	await Promise.all([loadShow(), loadSeason()]);
	if (!error.value) await prefetchAdjacentSeasons();
}

async function refresh() {
	error.value = null;
	show.value = null;
	episodes.value = [];
	seasonEpisodesCache.clear();
	await loadAll();
}

await loadAll();

watch(seasonNumber, () => {
	loadSeason();
});

watch(
	() => show.value?.id,
	() => {
		if (show.value) prefetchAdjacentSeasons();
	},
);

function formatNumber(value) {
	if (typeof value !== 'number') return '--';
	return String(value).padStart(2, '0');
}

function goToEpisode(episode) {
	if (!episode || !showId.value) return;
	router.push(`/watch/tv/${showId.value}/${episode.season_number}/${episode.episode_number}`);
}

function onSeasonChange(value) {
	if (!showId.value) return;
	const nextSeason = Number(value);
	if (!Number.isFinite(nextSeason) || nextSeason === seasonNumber.value) return;
	adjacentLoading.prev = false;
	adjacentLoading.next = false;
	router.push(`/watch/tv/${showId.value}/${nextSeason}/1`);
}

function onEpisodeChange(value) {
	if (!showId.value) return;
	const nextEpisodeNumber = Number(value);
	if (!Number.isFinite(nextEpisodeNumber) || nextEpisodeNumber === episodeNumber.value) return;
	router.push(`/watch/tv/${showId.value}/${seasonNumber.value}/${nextEpisodeNumber}`);
}

async function handlePrev() {
	const { target, ready } = prevEpisodeAcross.value;
	if (!target || !ready) {
		const adj = adjacentSeasonNumber.value.prev;
		if (typeof adj === 'number') {
			adjacentLoading.prev = true;
			try {
				const list = await ensureSeasonFetched(adj);
				if (list.length) {
					const sorted = [...list].sort((a, b) => (a.episode_number ?? 0) - (b.episode_number ?? 0));
					const last = sorted[sorted.length - 1];
					router.push(`/watch/tv/${showId.value}/${adj}/${last.episode_number}`);
				} else {
					router.push(`/watch/tv/${showId.value}/${adj}/1`);
				}
			} catch {
				toast.error('Could not load the previous season. Please try again.');
			} finally {
				adjacentLoading.prev = false;
			}
		}
		return;
	}
	goToEpisode(target);
}

async function handleNext() {
	const { target, ready } = nextEpisodeAcross.value;
	if (!target || !ready) {
		const adj = adjacentSeasonNumber.value.next;
		if (typeof adj === 'number') {
			adjacentLoading.next = true;
			try {
				const list = await ensureSeasonFetched(adj);
				if (list.length) {
					const sorted = [...list].sort((a, b) => (a.episode_number ?? 0) - (b.episode_number ?? 0));
					const first = sorted[0];
					router.push(`/watch/tv/${showId.value}/${adj}/${first.episode_number}`);
				} else {
					router.push(`/watch/tv/${showId.value}/${adj}/1`);
				}
			} catch {
				toast.error('Could not load the next season. Please try again.');
			} finally {
				adjacentLoading.next = false;
			}
		}
		return;
	}
	goToEpisode(target);
}

function episodeOptionLabel(ep) {
	const title = ep.name && ep.name.trim().length > 0 ? ep.name : `Episode ${ep.episode_number}`;
	return `E${formatNumber(ep.episode_number)} · ${title}`;
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
			<VideoPlayer :src="playerSrc" :fallback-src="playerFallbackSrc" :screenscape-src="playerScreenscapeSrc" />

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

				<div class="watch-page__pickers">
					<div class="watch-page__select-group">
						<label for="watch-season-select" class="watch-page__select-label">Season</label>
						<div class="watch-page__select-wrap">
							<select id="watch-season-select" class="watch-page__select" :value="seasonNumber" @change="(e) => onSeasonChange(e.target.value)">
								<optgroup v-if="playableSeasons.length" label="Seasons">
									<option v-for="s in playableSeasons" :key="s.season_number" :value="s.season_number">{{ s.name || `Season ${s.season_number}` }}{{ typeof s.episode_count === 'number' ? ` · ${s.episode_count} ep` : '' }}</option>
								</optgroup>
								<optgroup v-if="(show.seasons || []).filter((s) => typeof s.season_number === 'number' && s.season_number === 0).length" label="Specials">
									<option v-for="s in (show.seasons || []).filter((x) => typeof x.season_number === 'number' && x.season_number === 0)" :key="s.season_number" :value="s.season_number">{{ s.name || `Season ${s.season_number}` }}{{ typeof s.episode_count === 'number' ? ` · ${s.episode_count} ep` : '' }}</option>
								</optgroup>
							</select>
							<svg viewBox="0 0 24 24" aria-hidden="true" class="watch-page__select-arrow">
								<path fill="currentColor" d="M7 10l5 5 5-5z" />
							</svg>
						</div>
					</div>

					<div class="watch-page__select-group">
						<label for="watch-episode-select" class="watch-page__select-label">Episode</label>
						<div class="watch-page__select-wrap">
							<select id="watch-episode-select" class="watch-page__select" :value="episodeNumber" :disabled="seasonLoading || episodes.length === 0" @change="(e) => onEpisodeChange(e.target.value)">
								<option v-if="seasonLoading" disabled>Loading episodes…</option>
								<option v-else-if="seasonError" disabled>Failed to load episodes</option>
								<option v-else-if="episodes.length === 0" disabled>No episodes available</option>
								<template v-else>
									<option v-for="ep in sortedEpisodes" :key="ep.episode_number" :value="ep.episode_number">
										{{ episodeOptionLabel(ep) }}
									</option>
								</template>
							</select>
							<svg viewBox="0 0 24 24" aria-hidden="true" class="watch-page__select-arrow">
								<path fill="currentColor" d="M7 10l5 5 5-5z" />
							</svg>
						</div>
					</div>
				</div>

				<nav class="watch-page__nav" aria-label="Episode navigation">
					<Button variant="secondary" size="md" :disabled="(!prevEpisodeAcross.target || !prevEpisodeAcross.ready) && adjacentSeasonNumber.prev === null" @click="handlePrev">
						<svg viewBox="0 0 24 24" aria-hidden="true" class="watch-page__nav-icon">
							<path fill="none" stroke="currentColor" stroke-width="1.25" d="m14 7-5 5 5 5" />
						</svg>
						{{ adjacentLoading.prev ? 'Loading…' : 'Previous' }}
					</Button>
					<Button variant="primary" size="md" :disabled="(!nextEpisodeAcross.target || !nextEpisodeAcross.ready) && adjacentSeasonNumber.next === null" @click="handleNext">
						{{ adjacentLoading.next ? 'Loading…' : 'Next' }}
						<svg viewBox="0 0 24 24" aria-hidden="true" class="watch-page__nav-icon">
							<path fill="none" stroke="currentColor" stroke-width="1.25" d="m10 7 5 5-5 5" />
						</svg>
					</Button>
				</nav>
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

.watch-page__pickers {
	display: grid;
	grid-template-columns: 1fr;
	gap: 14px;
	padding: 16px 0;
	border-top: 1px solid var(--color-line);
	border-bottom: 1px solid var(--color-line);
}

@media (min-width: 640px) {
	.watch-page__pickers {
		grid-template-columns: 1fr 2fr;
		gap: 24px;
	}
}

.watch-page__select-group {
	display: flex;
	flex-direction: column;
	gap: 6px;
	min-width: 0;
}

.watch-page__select-label {
	font-family: var(--font-mono);
	font-size: 0.7rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--color-surface-400);
}

.watch-page__select-wrap {
	position: relative;
	display: flex;
	align-items: center;
}

.watch-page__select {
	appearance: none;
	background-color: transparent;
	color: var(--color-surface-50);
	border: 1px solid var(--color-line);
	border-radius: 0;
	padding: 10px 32px 10px 12px;
	width: 100%;
	font-family: var(--font-sans);
	font-size: 0.9rem;
	cursor: pointer;
	transition:
		border-color 500ms ease,
		color 500ms ease;
}

.watch-page__select:hover,
.watch-page__select:focus-visible {
	border-color: var(--color-brand);
	outline: none;
}

.watch-page__select:focus-visible {
	outline: 2px solid var(--color-brand);
	outline-offset: 2px;
}

.watch-page__select:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.watch-page__select option,
.watch-page__select optgroup {
	background-color: var(--color-bg-elevated);
	color: var(--color-surface-100);
	font-family: var(--font-sans);
}

.watch-page__select-arrow {
	position: absolute;
	right: 10px;
	width: 14px;
	height: 14px;
	pointer-events: none;
	color: var(--color-brand);
}

.watch-page__nav {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	justify-content: space-between;
}

@media (max-width: 480px) {
	.watch-page__nav {
		justify-content: stretch;
	}
}

.watch-page__nav-icon {
	width: 14px;
	height: 14px;
}
</style>
