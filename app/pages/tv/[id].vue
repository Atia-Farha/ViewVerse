<script setup>
import { posterLarge, tmdbShareImage } from '~/utils/tmdb.js';
import { formatDate, formatVoteCount, getYear } from '~/utils/format.js';
import { normalizeList } from '~/utils/media.js';
import { shareHeadMeta } from '~/utils/share.js';

const route = useRoute();
const router = useRouter();
const tmdb = useTmdb();
const toast = useToast();

const couldNotFindShow = "We couldn't find this show.";

const showId = computed(() => {
	const id = Number(route.params.id);
	return Number.isFinite(id) && id > 0 ? id : null;
});

const show = ref(null);
const cast = ref([]);
const crew = ref([]);
const similar = ref([]);
const recommendations = ref([]);
const trailer = ref(null);
const loading = ref(true);
const error = ref(null);

const seasons = ref([]);
const seasonNumber = ref(1);
const episodes = ref([]);
const episodesLoading = ref(false);
const episodesError = ref(false);

const seasonsForSelector = computed(() => {
	return seasons.value.filter((s) => typeof s.season_number === 'number');
});

async function loadEpisodes(season) {
	if (!showId.value || !Number.isFinite(season)) return;
	episodesLoading.value = true;
	episodesError.value = false;
	try {
		const data = await tmdb.tvSeason(showId.value, season);
		episodes.value = Array.isArray(data?.episodes) ? data.episodes : [];
		if (episodes.value.length === 0) {
			episodesError.value = true;
		}
	} catch {
		episodes.value = [];
		episodesError.value = true;
		toast.error('Could not load episodes for this season. Please try again.');
	} finally {
		episodesLoading.value = false;
	}
}

async function load() {
	if (!showId.value) {
		error.value = Object.assign(new Error('Invalid show id'), { status: 404 });
		loading.value = false;
		return;
	}
	loading.value = true;
	error.value = null;
	try {
		const data = await tmdb.tvDetails(showId.value);
		if (!data || !data.name) {
			error.value = Object.assign(new Error('TV show not found'), { status: 404 });
			show.value = null;
			return;
		}

		show.value = {
			id: data.id,
			title: data.name,
			tagline: data.tagline,
			overview: data.overview,
			rating: typeof data.vote_average === 'number' ? data.vote_average : null,
			voteCount: formatVoteCount(data.vote_count),
			year: getYear(data.first_air_date),
			firstAirDate: formatDate(data.first_air_date),
			lastAirDate: formatDate(data.last_air_date),
			status: data.status,
			genres: Array.isArray(data.genres) ? data.genres : [],
			networks: Array.isArray(data.networks) ? data.networks : [],
			companies: Array.isArray(data.production_companies) ? data.production_companies : [],
			numberOfSeasons: data.number_of_seasons,
			numberOfEpisodes: data.number_of_episodes,
			posterPath: data.poster_path,
			backdropPath: data.backdrop_path,
		};

		seasons.value = Array.isArray(data.seasons) ? data.seasons : [];
		const firstPlayable = seasons.value.find((s) => typeof s.season_number === 'number' && s.season_number > 0);
		const initialSeason = firstPlayable ? firstPlayable.season_number : 1;
		seasonNumber.value = initialSeason;
		await loadEpisodes(initialSeason);

		cast.value = Array.isArray(data.credits?.cast) ? data.credits.cast.slice(0, 20) : [];
		crew.value = Array.isArray(data.credits?.crew) ? data.credits.crew : [];

		const videos = Array.isArray(data.videos?.results) ? data.videos.results : [];
		const officialTrailer = videos.find((v) => v?.site === 'YouTube' && v?.type === 'Trailer' && v?.official) || videos.find((v) => v?.site === 'YouTube' && v?.type === 'Trailer') || videos.find((v) => v?.site === 'YouTube');
		if (officialTrailer?.key) {
			trailer.value = `https://www.youtube-nocookie.com/embed/${officialTrailer.key}`;
		} else {
			trailer.value = null;
		}

		similar.value = normalizeList(data.similar?.results || []);
		recommendations.value = normalizeList(data.recommendations?.results || []);
	} catch (err) {
		error.value = err;
		show.value = null;
	} finally {
		loading.value = false;
	}
}

watch(
	show,
	(value) => {
		if (!value?.title) return;
		const year = value.year ? ` (${value.year})` : '';
		const description = value.tagline || value.overview || '';
		const image = tmdbShareImage(value.backdropPath || value.posterPath);
		useHead({
			title: `${value.title}${year} | ViewVerse`,
			meta: shareHeadMeta({
				title: `${value.title}${year} | ViewVerse`,
				description,
				path: `/tv/${value.id}`,
				image,
				type: 'video.movie',
			}),
		});
	},
	{ immediate: true },
);

async function refresh() {
	await load();
}

await load();

watch(seasonNumber, (value) => {
	loadEpisodes(value);
});

const posterUrl = computed(() => posterLarge(show.value?.posterPath));

function playFirst() {
	if (!show.value) return;
	router.push(`/watch/tv/${show.value.id}/${seasonNumber.value}/1`);
}

const showFacts = computed(() => {
	const s = show.value;
	if (!s) return [];
	return [
		{ label: 'First Aired', value: s.firstAirDate },
		{ label: 'Last Aired', value: s.lastAirDate },
		{ label: 'Seasons', value: s.numberOfSeasons || null },
		{ label: 'Episodes', value: s.numberOfEpisodes || null },
		{ label: 'Networks', value: s.networks.length ? s.networks.map((n) => n.name).join(', ') : null },
		{ label: 'Production', value: s.companies.length ? s.companies.map((c) => c.name).join(', ') : null },
	];
});
</script>

<template>
	<div v-if="loading" class="tv-details tv-details--loading">
		<div class="tv-details__hero-skeleton">
			<Skeleton height="60vh" rounded="none" />
		</div>
		<div class="tv-details__body">
			<Skeleton width="50%" height="44px" rounded="none" />
			<Skeleton width="30%" height="16px" rounded="none" />
		</div>
	</div>

	<ErrorState v-else-if="error" :title="error.status === 404 ? 'TV show not found' : 'Unable to load content'" :message="error.status === 404 ? couldNotFindShow : 'Please try again.'" @retry="refresh" />

	<EmptyState icon="tv" v-else-if="!show" title="Show not found" message="We couldn't load this TV show." />

	<div v-else class="tv-details">
		<DetailsHero :backdrop-path="show.backdropPath" />

		<div class="tv-details__layout">
			<div class="tv-details__poster">
				<TmdbImage :src="posterUrl" :alt="show.title || ''" ratio="2/3" rounded="sm" />
			</div>

			<div class="tv-details__main">
				<div class="tv-details__meta-row">
					<span v-if="show.year" class="tv-details__year">{{ show.year }}</span>
					<span v-if="show.status" class="tv-details__status">{{ show.status }}</span>
					<span v-if="show.rating !== null" class="tv-details__rating">
						<Rating :value="show.rating" />
					</span>
					<span v-if="show.voteCount" class="tv-details__votes">{{ show.voteCount }} votes</span>
				</div>

				<h1 class="tv-details__title">{{ show.title }}</h1>

				<p v-if="show.tagline" class="tv-details__tagline">"{{ show.tagline }}"</p>

				<div v-if="show.genres.length" class="tv-details__genres">
					<Badge v-for="genre in show.genres" :key="genre.id || genre.name" :text="genre.name" variant="default" />
				</div>

				<p v-if="show.overview" class="tv-details__overview">{{ show.overview }}</p>

				<div class="tv-details__actions">
					<Button variant="primary" size="lg" @click="playFirst">
						<svg viewBox="0 0 24 24" aria-hidden="true" class="tv-details__play-icon">
							<path fill="currentColor" d="M8 5v14l11-7z" />
						</svg>
						<span>Play S{{ seasonNumber }}E1</span>
					</Button>
					<WhitelistButton :id="show.id" media-type="tv" :title="show.title" :poster-path="show.posterPath" size="lg" />
				</div>

				<MediaFacts :facts="showFacts" />
			</div>
		</div>

		<section v-if="trailer" class="tv-details__trailer">
			<div class="tv-details__trailer-frame">
				<iframe :src="trailer" title="Trailer" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy" />
			</div>
		</section>

		<section class="tv-details__seasons">
			<header class="tv-details__seasons-header">
				<TvSeasonSelector v-model="seasonNumber" :seasons="seasonsForSelector" />
			</header>
			<div class="tv-details__seasons-body">
				<ErrorState v-if="episodesError && !episodesLoading" title="Episodes unavailable" message="We couldn't load the episodes for this season." @retry="loadEpisodes(seasonNumber)" />
				<EpisodeList v-else :episodes="episodes" :loading="episodesLoading" :tv-id="show.id" />
			</div>
		</section>

		<CastScroller :people="cast" label="Cast" />

		<CrewList :crew="crew" />

		<section v-if="similar.length > 0" class="tv-details__similar">
			<ContentRow title="Similar" :items="similar" hide-when-empty>
				<template #default="{ item }">
					<TvCard :item="item" />
				</template>
			</ContentRow>
		</section>

		<section v-if="recommendations.length > 0" class="tv-details__recommendations">
			<ContentRow title="Recommended" :items="recommendations" hide-when-empty>
				<template #default="{ item }">
					<TvCard :item="item" />
				</template>
			</ContentRow>
		</section>
	</div>
</template>

<style scoped>
.tv-details {
	display: flex;
	flex-direction: column;
	gap: 0;
	padding-bottom: 64px;
}

.tv-details__layout {
	display: grid;
	grid-template-columns: 1fr;
	gap: 28px;
	padding: 32px 4vw 0;
	max-width: var(--layout-max);
	margin: 0 auto;
}

@media (min-width: 768px) {
	.tv-details__layout {
		grid-template-columns: 220px 1fr;
		gap: 36px;
	}
}

@media (min-width: 1024px) {
	.tv-details__layout {
		grid-template-columns: 280px 1fr;
		gap: 48px;
	}
}

.tv-details__poster {
	width: 160px;
	margin: 0 auto;
}

@media (min-width: 768px) {
	.tv-details__poster {
		width: 100%;
		max-width: 280px;
		margin: 0;
	}
}

.tv-details__main {
	display: flex;
	flex-direction: column;
	gap: 14px;
	padding-top: 8px;
	border-top: 1px solid var(--color-line);
}

@media (min-width: 768px) {
	.tv-details__main {
		padding-top: 24px;
		border-top: 0;
	}
}

.tv-details__meta-row {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 6px 16px;
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.78rem;
	letter-spacing: 0.04em;
	color: var(--color-surface-400);
}

.tv-details__year {
	font-weight: 500;
	color: var(--color-surface-50);
}

.tv-details__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.8rem, 4.5vw, 3.2rem);
	font-weight: 500;
	line-height: 1.1;
	letter-spacing: -0.01em;
	color: var(--color-surface-50);
	text-wrap: balance;
}

.tv-details__tagline {
	margin: 0;
	color: var(--color-surface-400);
	font-family: var(--font-display);
	font-style: italic;
	font-size: 1rem;
	font-weight: 400;
}

.tv-details__genres {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 4px;
}

.tv-details__overview {
	margin: 8px 0 0;
	color: var(--color-surface-200);
	font-size: 1rem;
	line-height: 1.65;
	max-width: 64ch;
}

.tv-details__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin-top: 16px;
}

.tv-details__play-icon {
	width: 20px;
	height: 20px;
}

.tv-details__seasons {
	padding: 40px 0 0;
	max-width: var(--layout-max);
	margin: 0 auto;
	width: 100%;
}

.tv-details__seasons-header {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 16px;
	justify-content: space-between;
	margin-bottom: 0;
	padding: 0 4vw 12px;
	border-bottom: 1px solid var(--color-line);
}

.tv-details__seasons-body {
	padding: 0 4vw;
}

.tv-details__trailer,
.tv-details__similar,
.tv-details__recommendations {
	padding: 40px 0 0;
}

.tv-details__trailer-frame {
	position: relative;
	width: calc(100% - 8vw);
	max-width: var(--layout-max);
	margin: 0 auto;
	aspect-ratio: 16 / 9;
	background-color: var(--color-bg-elevated);
	border: 1px solid var(--color-line);
	border-radius: 0;
	overflow: hidden;
}

.tv-details__trailer-frame iframe {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	border: 0;
}
</style>
