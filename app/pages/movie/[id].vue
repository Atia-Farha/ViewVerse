<script setup>
import { posterLarge, tmdbShareImage } from '~/utils/tmdb.js';
import { formatDate, formatRuntime, getYear, formatVoteCount } from '~/utils/format.js';
import { normalizeList } from '~/utils/media.js';
import { shareHeadMeta } from '~/utils/share.js';

const route = useRoute();
const router = useRouter();
const tmdb = useTmdb();

const couldNotFindMovie = "We couldn't find this movie.";

const movieId = computed(() => {
	const id = Number(route.params.id);
	return Number.isFinite(id) && id > 0 ? id : null;
});

const movie = ref(null);
const cast = ref([]);
const crew = ref([]);
const similar = ref([]);
const recommendations = ref([]);
const trailer = ref(null);
const loading = ref(true);
const error = ref(null);

async function load() {
	if (!movieId.value) {
		error.value = Object.assign(new Error('Invalid movie id'), { status: 404 });
		loading.value = false;
		return;
	}
	loading.value = true;
	error.value = null;
	try {
		const data = await tmdb.movieDetails(movieId.value);
		if (!data || !data.title) {
			error.value = Object.assign(new Error('Movie not found'), { status: 404 });
			movie.value = null;
			return;
		}
		movie.value = {
			id: data.id,
			title: data.title,
			originalTitle: data.original_title,
			tagline: data.tagline,
			overview: data.overview,
			rating: typeof data.vote_average === 'number' ? data.vote_average : null,
			voteCount: formatVoteCount(data.vote_count),
			runtime: formatRuntime(data.runtime),
			year: getYear(data.release_date),
			releaseDate: formatDate(data.release_date),
			status: data.status,
			genres: Array.isArray(data.genres) ? data.genres : [],
			companies: Array.isArray(data.production_companies) ? data.production_companies : [],
			countries: Array.isArray(data.production_countries) ? data.production_countries : [],
			languages: Array.isArray(data.spoken_languages) ? data.spoken_languages : [],
			posterPath: data.poster_path,
			backdropPath: data.backdrop_path,
		};

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
		movie.value = null;
	} finally {
		loading.value = false;
	}
}

watch(
	movie,
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
				path: `/movie/${value.id}`,
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

const posterUrl = computed(() => posterLarge(movie.value?.posterPath));

const movieFacts = computed(() => {
	const m = movie.value;
	if (!m) return [];
	return [
		{ label: 'Status', value: m.status },
		{ label: 'Release', value: m.releaseDate },
		{ label: 'Production', value: m.companies.length ? m.companies.map((c) => c.name).join(', ') : null },
		{ label: 'Countries', value: m.countries.length ? m.countries.map((c) => c.name).join(', ') : null },
		{ label: 'Languages', value: m.languages.length ? m.languages.map((l) => l.name || l.english_name).join(', ') : null },
	];
});

function play() {
	if (!movie.value) return;
	router.push(`/watch/movie/${movie.value.id}`);
}
</script>

<template>
	<div v-if="loading" class="movie-details movie-details--loading">
		<div class="movie-details__hero-skeleton">
			<Skeleton height="60vh" rounded="none" />
		</div>
		<div class="movie-details__body">
			<Skeleton width="50%" height="44px" rounded="none" />
			<Skeleton width="30%" height="16px" rounded="none" />
			<Skeleton width="100%" height="14px" rounded="none" />
			<Skeleton width="92%" height="14px" rounded="none" />
		</div>
	</div>

	<ErrorState v-else-if="error" :title="error.status === 404 ? 'Movie not found' : 'Unable to load content'" :message="error.status === 404 ? couldNotFindMovie : 'Please try again.'" @retry="refresh" />

	<EmptyState icon="film" v-else-if="!movie" title="Movie not found" message="We couldn't load this movie." />

	<div v-else class="movie-details">
		<DetailsHero :backdrop-path="movie.backdropPath" />

		<div class="movie-details__layout">
			<div class="movie-details__poster">
				<TmdbImage :src="posterUrl" :alt="movie.title || ''" ratio="2/3" rounded="sm" />
			</div>

			<div class="movie-details__main">
				<div class="movie-details__meta-row">
					<span v-if="movie.year" class="movie-details__year">{{ movie.year }}</span>
					<span v-if="movie.runtime" class="movie-details__runtime">{{ movie.runtime }}</span>
					<span v-if="movie.rating !== null" class="movie-details__rating">
						<Rating :value="movie.rating" />
					</span>
					<span v-if="movie.voteCount" class="movie-details__votes">{{ movie.voteCount }} votes</span>
				</div>

				<h1 class="movie-details__title">
					{{ movie.title }}
					<span v-if="movie.originalTitle && movie.originalTitle !== movie.title" class="movie-details__original"> ({{ movie.originalTitle }}) </span>
				</h1>

				<p v-if="movie.tagline" class="movie-details__tagline">"{{ movie.tagline }}"</p>

				<div v-if="movie.genres.length" class="movie-details__genres">
					<Badge v-for="genre in movie.genres" :key="genre.id || genre.name" :text="genre.name" variant="default" />
				</div>

				<p v-if="movie.overview" class="movie-details__overview">{{ movie.overview }}</p>

				<div class="movie-details__actions">
					<Button variant="primary" size="lg" @click="play">
						<svg viewBox="0 0 24 24" aria-hidden="true" class="movie-details__play-icon">
							<path fill="currentColor" d="M8 5v14l11-7z" />
						</svg>
						<span>Play</span>
					</Button>
					<WhitelistButton :id="movie.id" media-type="movie" :title="movie.title" :poster-path="movie.posterPath" size="lg" />
				</div>

				<MediaFacts :facts="movieFacts" />
			</div>
		</div>

		<section v-if="trailer" class="movie-details__trailer">
			<div class="movie-details__trailer-frame">
				<iframe :src="trailer" title="Trailer" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy" />
			</div>
		</section>

		<CastScroller :people="cast" label="Cast" />

		<CrewList :crew="crew" />

		<section v-if="similar.length > 0" class="movie-details__similar">
			<ContentRow title="Similar" :items="similar" hide-when-empty>
				<template #default="{ item }">
					<MovieCard :item="item" />
				</template>
			</ContentRow>
		</section>

		<section v-if="recommendations.length > 0" class="movie-details__recommendations">
			<ContentRow title="Recommended" :items="recommendations" hide-when-empty>
				<template #default="{ item }">
					<MovieCard :item="item" />
				</template>
			</ContentRow>
		</section>
	</div>
</template>

<style scoped>
.movie-details {
	display: flex;
	flex-direction: column;
	gap: 0;
	padding-bottom: 64px;
}

.movie-details__layout {
	display: grid;
	grid-template-columns: 1fr;
	gap: 28px;
	padding: 32px 4vw 0;
	max-width: var(--layout-max);
	margin: 0 auto;
}

@media (min-width: 768px) {
	.movie-details__layout {
		grid-template-columns: 220px 1fr;
		gap: 36px;
	}
}

@media (min-width: 1024px) {
	.movie-details__layout {
		grid-template-columns: 280px 1fr;
		gap: 48px;
	}
}

.movie-details__poster {
	width: 160px;
	margin: 0 auto;
}

@media (min-width: 768px) {
	.movie-details__poster {
		width: 100%;
		max-width: 280px;
		margin: 0;
	}
}

.movie-details__main {
	display: flex;
	flex-direction: column;
	gap: 14px;
	padding-top: 8px;
	border-top: 1px solid var(--color-line);
}

@media (min-width: 768px) {
	.movie-details__main {
		padding-top: 24px;
		border-top: 0;
	}
}

.movie-details__meta-row {
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

.movie-details__year {
	font-weight: 500;
	color: var(--color-surface-50);
}

.movie-details__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.8rem, 4.5vw, 3.2rem);
	font-weight: 500;
	line-height: 1.1;
	letter-spacing: -0.01em;
	color: var(--color-surface-50);
	text-wrap: balance;
}

.movie-details__original {
	color: var(--color-surface-400);
	font-size: 0.5em;
	font-weight: 400;
	font-style: italic;
	margin-left: 8px;
}

.movie-details__tagline {
	margin: 0;
	color: var(--color-surface-400);
	font-family: var(--font-display);
	font-style: italic;
	font-size: 1rem;
	font-weight: 400;
}

.movie-details__genres {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 4px;
}

.movie-details__overview {
	margin: 8px 0 0;
	color: var(--color-surface-200);
	font-size: 1rem;
	line-height: 1.65;
	max-width: 64ch;
}

.movie-details__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin-top: 16px;
}

.movie-details__play-icon {
	width: 20px;
	height: 20px;
}

.movie-details__trailer,
.movie-details__similar,
.movie-details__recommendations {
	padding: 32px 0 0;
}

.movie-details__trailer-frame {
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

.movie-details__trailer-frame iframe {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	border: 0;
}
</style>
