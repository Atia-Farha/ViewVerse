<script setup>
import { computed, ref } from 'vue';
import { formatRuntime, getYear, truncate } from '~/utils/format.js';
import { normalizeList, normalizeMedia } from '~/utils/media.js';

definePageMeta({
	name: 'home',
});

useHead({
	title: 'ViewVerse. Home',
});

const tmdb = useTmdb();

const rows = ref({
	trending: [],
	popularMovies: [],
	popularTv: [],
	topRated: [],
	nowPlaying: [],
	upcoming: [],
	airingToday: [],
});

const errors = ref({});
const heroMovie = ref(null);

const hasErrors = computed(() => Object.values(errors.value).some(Boolean));

const heroItem = computed(() => {
	const m = heroMovie.value;
	if (!m) return null;
	const mediaType = m.first_air_date ? 'tv' : 'movie';
	const genres = Array.isArray(m.genres) ? m.genres.map((g) => g.name).filter(Boolean) : [];
	return {
		id: m.id,
		mediaType,
		title: m.title || m.name || m.original_title || '',
		backdropPath: m.backdrop_path || null,
		rating: typeof m.vote_average === 'number' ? m.vote_average : null,
		year: getYear(m.release_date || m.first_air_date),
		runtime: formatRuntime(m.runtime),
		genres,
		overview: truncate(m.overview || '', 320),
		posterPath: m.poster_path || null,
	};
});

function setRow(key, list, fallback = []) {
	rows.value[key] = list.length ? list : fallback;
	errors.value[key] = list.length === 0 && fallback.length === 0;
}

async function loadRow(name, fetcher) {
	try {
		const data = await fetcher();
		const results = Array.isArray(data?.results) ? data.results : [];
		return normalizeList(results);
	} catch (err) {
		console.warn(`[home] row ${name} failed`, err);
		return [];
	}
}

async function loadHero() {
	try {
		const trending = await tmdb.trending('all', 'week');
		const top = Array.isArray(trending?.results) ? trending.results.find(Boolean) : null;
		if (!top) return;
		const isTv = top.media_type === 'tv' || top.first_air_date;
		const details = isTv ? await tmdb.tvDetails(top.id) : await tmdb.movieDetails(top.id);
		heroMovie.value = details || null;
	} catch (err) {
		console.warn('[home] hero failed', err);

		try {
			const trending = await tmdb.trending('all', 'week');
			const top = Array.isArray(trending?.results) ? trending.results[0] : null;
			if (top) {
				const normalized = normalizeMedia(top);
				if (normalized) {
					heroMovie.value = {
						...top,
						backdrop_path: normalized.backdrop_path,
						poster_path: normalized.poster_path,
						runtime: null,
						genres: [],
					};

					if (typeof heroMovie.value.vote_average !== 'number') {
						heroMovie.value.vote_average = null;
					}
				}
			}
		} catch {}
	}
}

async function refresh() {
	await Promise.all([loadAll(), loadHero()]);
}

async function loadAll() {
	errors.value = {};
	const [trending, popularM, popularTv, topRated, nowPlaying, upcoming, airingToday] = await Promise.all([
		loadRow('trending', () => tmdb.trending('all', 'week')),
		loadRow('popularMovies', () => tmdb.moviePopular()),
		loadRow('popularTv', () => tmdb.tvPopular()),

		loadRow('topRated', async () => {
			const [m, t] = await Promise.all([tmdb.movieTopRated(), tmdb.tvTopRated()]);
			const allItems = [...(m?.results || []), ...(t?.results || [])];
			allItems.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));

			return { results: allItems.slice(0, 20) };
		}),
		loadRow('nowPlaying', () => tmdb.movieNowPlaying()),
		loadRow('upcoming', () => tmdb.movieUpcoming()),
		loadRow('airingToday', () => tmdb.tvAiringToday()),
	]);

	setRow('trending', trending);
	setRow('popularMovies', popularM);
	setRow('popularTv', popularTv);
	setRow('topRated', topRated);
	setRow('nowPlaying', nowPlaying);
	setRow('upcoming', upcoming);
	setRow('airingToday', airingToday);
}

await Promise.all([loadHero(), loadAll()]);

function onPlayHero(item) {
	if (!item) return;
	if (item.mediaType === 'tv') {
		navigateTo(`/tv/${item.id}`);
		return;
	}
	navigateTo(`/watch/movie/${item.id}`);
}
</script>

<template>
	<div class="home">
		<MovieHero v-if="heroItem" :item="heroItem" @play="onPlayHero" />
		<div v-else class="home__hero-skeleton" aria-hidden="true">
			<Skeleton height="78vh" rounded="none" />
			<div class="home__hero-skeleton-body">
				<Skeleton width="55%" height="56px" rounded="md" />
				<Skeleton width="38%" height="20px" rounded="sm" />
				<Skeleton width="85%" height="14px" rounded="sm" />
				<Skeleton width="80%" height="14px" rounded="sm" />
			</div>
		</div>

		<div v-if="hasErrors" class="home__error">
			<ErrorState title="Some sections failed to load" message="We couldn't fetch all recommendations. Please retry." @retry="refresh" />
		</div>

		<ContentRow title="Trending This Week" :items="rows.trending" view-all-href="/movies">
			<template #default="{ item }">
				<MovieCard :item="item" />
			</template>
			<template v-if="rows.trending.length === 0" #append>
				<li v-for="i in 6" :key="`trend-skeleton-${i}`" class="home__skeleton-item">
					<Skeleton height="100%" rounded="md" />
				</li>
			</template>
		</ContentRow>

		<ContentRow title="Popular Movies" :items="rows.popularMovies" view-all-href="/movies">
			<template #default="{ item }">
				<MovieCard :item="item" />
			</template>
		</ContentRow>

		<ContentRow title="Popular TV Shows" :items="rows.popularTv" view-all-href="/tv">
			<template #default="{ item }">
				<TvCard :item="item" />
			</template>
		</ContentRow>

		<ContentRow title="Top Rated" :items="rows.topRated">
			<template #default="{ item }">
				<TvCard v-if="item.media_type === 'tv'" :item="item" />
				<MovieCard v-else :item="item" />
			</template>
		</ContentRow>

		<ContentRow title="Now Playing" :items="rows.nowPlaying">
			<template #default="{ item }">
				<MovieCard :item="item" />
			</template>
		</ContentRow>

		<ContentRow title="Upcoming" :items="rows.upcoming" view-all-href="/movies/upcoming">
			<template #default="{ item }">
				<MovieCard :item="item" />
			</template>
		</ContentRow>

		<ContentRow title="Airing Today" :items="rows.airingToday" view-all-href="/tv/airing-today">
			<template #default="{ item }">
				<TvCard :item="item" />
			</template>
		</ContentRow>

		<GenresList />
	</div>
</template>

<style scoped>
.home {
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding-bottom: 64px;
}

.home__hero-skeleton {
	position: relative;
	min-height: 78vh;
	max-height: 880px;
	overflow: hidden;
}

.home__hero-skeleton-body {
	position: absolute;
	left: 4vw;
	right: 4vw;
	bottom: 56px;
	max-width: 720px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.home__error {
	padding: 0 4vw;
}

.home__skeleton-item {
	aspect-ratio: 2 / 3;
}
</style>
