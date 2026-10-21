<script setup>
import { formatDate, formatRuntime, formatVoteCount, getYear } from '~/utils/format.js';
import { buildCinesrcMovieUrl } from '~/utils/cinesrc.js';
import { buildVidfastMovieUrl } from '~/utils/vidfast.js';
import { buildScreenscapeMovieUrl } from '~/utils/screenscape.js';
import { shareHeadMeta } from '~/utils/share.js';
import { tmdbShareImage } from '~/utils/tmdb.js';

definePageMeta({
	name: 'watch-movie',
});

const route = useRoute();
const router = useRouter();
const tmdb = useTmdb();

const movieId = computed(() => {
	const id = Number(route.params.id);
	return Number.isFinite(id) && id > 0 ? id : null;
});

const movie = ref(null);
const error = ref(null);

const playerSrc = computed(() => {
	if (!movieId.value) return '';
	return buildCinesrcMovieUrl(movieId.value, { autoplay: true });
});

const playerFallbackSrc = computed(() => {
	if (!movieId.value) return '';
	return buildVidfastMovieUrl(movieId.value, { autoPlay: true });
});

const playerScreenscapeSrc = computed(() => {
	if (!movieId.value) return '';
	return buildScreenscapeMovieUrl(movieId.value);
});

const hasFacts = computed(() => {
	if (!movie.value) return false;
	return movie.value.releaseDate || movie.value.genres.length || movie.value.companies.length || movie.value.countries.length;
});

async function load() {
	if (!movieId.value) {
		error.value = Object.assign(new Error('Invalid movie id'), { status: 404 });
		return;
	}
	try {
		const data = await tmdb.movieDetails(movieId.value);
		if (!data) {
			error.value = Object.assign(new Error('Movie not found'), { status: 404 });
			return;
		}
		movie.value = {
			id: data.id,
			title: data.title,
			overview: data.overview,
			rating: typeof data.vote_average === 'number' ? data.vote_average : null,
			voteCount: formatVoteCount(data.vote_count),
			year: getYear(data.release_date),
			runtime: formatRuntime(data.runtime),
			releaseDate: formatDate(data.release_date),
			posterPath: data.poster_path || null,
			genres: Array.isArray(data.genres) ? data.genres : [],
			companies: Array.isArray(data.production_companies) ? data.production_companies : [],
			countries: Array.isArray(data.production_countries) ? data.production_countries : [],
		};
	} catch (err) {
		error.value = err;
	}
}

watch(
	movie,
	(value) => {
		if (!value?.title) return;
		const year = value.year ? ` (${value.year})` : '';
		const description = value.overview || `Watch ${value.title} on ViewVerse.`;
		const image = tmdbShareImage(value.backdropPath || value.posterPath);
		useHead({
			title: `${value.title} | ViewVerse`,
			meta: shareHeadMeta({
				title: `Watching ${value.title}${year} | ViewVerse`,
				description,
				path: `/watch/movie/${value.id}`,
				image,
				type: 'video.movie',
			}),
		});
	},
	{ immediate: true },
);

async function refresh() {
	error.value = null;
	movie.value = null;
	await load();
}

await load();

function goBack() {
	if (typeof window !== 'undefined' && window.history.length > 1) {
		router.back();
		return;
	}
	router.push(`/movie/${movieId.value}`);
}
</script>

<template>
	<WatchPage :title="movie?.title" @back="goBack">
		<ErrorState v-if="error" :title="error.status === 404 ? 'Movie not found' : 'Unable to load the player'" :message="error.status === 404 ? 'We could not find the requested movie.' : error.message || 'Please try again.'" :show-retry="error.status !== 404" @retry="refresh" />

		<div v-else-if="!movie" class="watch-page__loading">
			<Skeleton height="56.25vw" rounded="none" />
		</div>

		<div v-else class="watch-page__content">
			<VideoPlayer :src="playerSrc" :fallback-src="playerFallbackSrc" :screenscape-src="playerScreenscapeSrc" />

			<section v-if="movie" class="watch-page__info">
				<div class="watch-page__info-grid">
					<div class="watch-page__primary">
						<div class="watch-page__meta">
							<span v-if="movie.rating !== null" class="watch-page__meta-chip watch-page__meta-chip--rating">
								<Rating :value="movie.rating" />
							</span>
							<MetaChip v-if="movie.year" :label="movie.year" class="watch-page__meta-chip--year" />
							<MetaChip v-if="movie.runtime" :label="movie.runtime" />
						</div>

						<p v-if="movie.overview" class="watch-page__overview">{{ movie.overview }}</p>
					</div>

					<aside class="watch-page__actions" aria-label="Save">
						<WhitelistButton :id="movie.id" media-type="movie" :title="movie.title" :poster-path="movie.posterPath" :show-label="true" size="md" variant="secondary" />
					</aside>
				</div>

				<div v-if="hasFacts" class="watch-page__facts">
					<div v-if="movie.releaseDate" class="watch-page__fact">
						<span class="watch-page__fact-label">Release</span>
						<span class="watch-page__fact-value">{{ movie.releaseDate }}</span>
					</div>

					<div v-if="movie.genres.length" class="watch-page__fact">
						<span class="watch-page__fact-label">Genre</span>
						<span class="watch-page__fact-value">{{ movie.genres.map((g) => g.name).join(', ') }}</span>
					</div>

					<div v-if="movie.companies.length" class="watch-page__fact">
						<span class="watch-page__fact-label">Production</span>
						<span class="watch-page__fact-value">{{ movie.companies.map((c) => c.name).join(', ') }}</span>
					</div>

					<div v-if="movie.countries.length" class="watch-page__fact">
						<span class="watch-page__fact-label">Country</span>
						<span class="watch-page__fact-value">{{ movie.countries.map((c) => c.name).join(', ') }}</span>
					</div>
				</div>
			</section>
		</div>
	</WatchPage>
</template>

<style scoped>
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

.watch-page__facts {
	display: grid;
	grid-template-columns: 1fr;
	gap: 0;
	border-top: 1px solid var(--color-line);
	margin-top: 8px;
}

@media (min-width: 768px) {
	.watch-page__facts {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		column-gap: 32px;
	}
}

.watch-page__fact {
	display: grid;
	grid-template-columns: 90px 1fr;
	align-items: baseline;
	gap: 16px;
	padding: 14px 0;
	border-bottom: 1px solid var(--color-line);
}

.watch-page__fact-label {
	font-family: var(--font-mono);
	font-size: 0.7rem;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--color-surface-500);
}

.watch-page__fact-value {
	margin: 0;
	color: var(--color-surface-200);
	font-size: 0.9rem;
	line-height: 1.5;
	min-width: 0;
	overflow-wrap: anywhere;
}
</style>
