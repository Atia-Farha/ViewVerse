<script setup>
import { Award, Clapperboard, Compass, Drama, Film, Flag, Flame, Gamepad2, Ghost, Heart, HeartHandshake, Landmark, Laugh, MessagesSquare, Music, Newspaper, Orbit, Palette, Rocket, Search, Shield, Siren, Swords, Tv, Users, Video, Wand2, Zap } from 'lucide-vue-next';

defineProps({
	hideHeader: { type: Boolean, default: false },
});

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
	} catch {
		genres.value = [];
	} finally {
		loading.value = false;
	}
}

const GENRE_ICONS = {
	28: Flame, // Action
	12: Compass, // Adventure
	16: Palette, // Animation
	35: Laugh, // Comedy
	80: Siren, // Crime
	99: Video, // Documentary
	18: Drama, // Drama
	10751: Users, // Family
	14: Wand2, // Fantasy
	36: Landmark, // History
	27: Ghost, // Horror
	10402: Music, // Music
	9648: Search, // Mystery
	10749: Heart, // Romance
	878: Rocket, // Sci-Fi
	10770: Tv, // TV Movie
	53: Zap, // Thriller
	10752: Shield, // War
	37: Award, // Western
	10759: Swords, // Action & Adventure (TV)
	10762: Gamepad2, // Kids (TV)
	10763: Newspaper, // News (TV)
	10764: Clapperboard, // Reality (TV)
	10765: Orbit, // Sci-Fi & Fantasy (TV)
	10766: HeartHandshake, // Soap (TV)
	10767: MessagesSquare, // Talk (TV)
	10768: Flag, // War & Politics (TV)
};

function getGenreIcon(id) {
	return GENRE_ICONS[id] || Film;
}

await load();
</script>

<template>
	<section class="genres-list" aria-label="Genres">
		<header v-if="!hideHeader" class="genres-list__header">
			<h2 class="t-h2 genres-list__title">Browse by Genre</h2>
		</header>

		<div v-if="loading" class="genres-list__skeletons" aria-hidden="true">
			<div v-for="i in 9" :key="i" class="genres-list__skeleton" />
		</div>

		<ul v-else-if="genres.length > 0" class="genres-list__grid">
			<li v-for="g in genres" :key="g.id" class="genres-list__item-wrap">
				<NuxtLink :to="`/genre/${g.id}`" class="genres-list__item">
					<span class="genres-list__corner" aria-hidden="true">
						<component :is="getGenreIcon(g.id)" class="genres-list__glyph" :stroke-width="1.6" aria-hidden="true" />
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
		border-color 500ms ease,
		background-color 500ms ease,
		color 500ms ease;
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
		color 500ms ease,
		transform 500ms cubic-bezier(0.2, 0.7, 0.2, 1);
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
