<script setup>
import { computed, ref } from 'vue';
import { profileImage, posterThumb, tmdbShareImage } from '~/utils/tmdb.js';
import { formatDate, getYear } from '~/utils/format.js';
import { shareHeadMeta } from '~/utils/share.js';

definePageMeta({ name: 'person' });

const route = useRoute();
const router = useRouter();
const tmdb = useTmdb();

const personId = computed(() => {
	const id = Number(route.params.id);
	return Number.isFinite(id) && id > 0 ? id : null;
});

const person = ref(null);
const error = ref(null);
const loading = ref(true);

const acting = ref([]);
const crew = ref([]);

const activeTab = ref('acting');

const portraitSrc = computed(() => profileImage(person.value?.profile_path, 'h632'));

const castCount = computed(() => acting.value.length);
const crewCount = computed(() => crew.value.length);

const actingCredits = computed(() => {
	const list = acting.value.map((c) => ({
		id: c.id,
		media_type: c.media_type,
		title: c.title || c.name || '',
		poster_path: c.poster_path,
		backdrop_path: c.backdrop_path,
		year: getYear(c.release_date || c.first_air_date),
		rating: typeof c.vote_average === 'number' ? c.vote_average : null,
		vote_count: typeof c.vote_count === 'number' ? c.vote_count : null,
		overview: c.overview || null,
		known_for: null,
		character: c.character || null,
		episode_count: typeof c.episode_count === 'number' ? c.episode_count : null,
		date: c.release_date || c.first_air_date || '',
	}));

	list.sort((a, b) => {
		if (b.date !== a.date) return (b.date || '').localeCompare(a.date || '');
		return 0;
	});
	return list;
});

const crewCredits = computed(() => {
	return crew.value.slice(0, 24).map((c) => ({
		key: `${c.media_type}-${c.id}-${c.job}-${c.release_date || c.first_air_date || ''}`,
		id: c.id,
		media_type: c.media_type,
		title: c.title || c.name || '',
		poster: posterThumb(c.poster_path),
		year: getYear(c.release_date || c.first_air_date),
		job: c.job || c.department || '',
	}));
});

function creditLink(credit) {
	if (!credit?.id) return '#';
	return credit.media_type === 'tv' ? `/tv/${credit.id}` : `/movie/${credit.id}`;
}

function actingPoster(credit) {
	return posterThumb(credit?.poster_path);
}

const availableTabs = computed(() => {
	const tabs = [];
	if (castCount.value > 0) tabs.push({ value: 'acting', label: 'Acting', count: castCount.value });
	if (crewCount.value > 0) tabs.push({ value: 'crew', label: 'Crew', count: crewCount.value });
	return tabs;
});

const creditsLine = computed(() => {
	const parts = [];
	if (castCount.value) parts.push(`${castCount.value} as cast`);
	if (crewCount.value) parts.push(`${crewCount.value} as crew`);
	return parts.join(' · ');
});

const popularMovieTitle = computed(() => {
	const top = acting.value
		.slice()
		.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
		.find((c) => c.title || c.name);
	return top ? top.title || top.name : null;
});

const ageYears = computed(() => {
	const birthday = person.value?.birthday;
	if (!birthday || person.value?.deathday) return null;
	const birth = new Date(birthday);
	if (Number.isNaN(birth.getTime())) return null;
	const now = new Date();
	let age = now.getFullYear() - birth.getFullYear();
	const m = now.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
	return age > 0 ? age : null;
});

const popularity = computed(() => {
	const v = person.value?.popularity;
	return typeof v === 'number' ? v.toFixed(1) : null;
});

const genderLabel = computed(() => {
	const g = person.value?.gender;
	if (g === 1) return 'Female';
	if (g === 2) return 'Male';
	if (g === 3) return 'Non-binary';
	return 'Not specified';
});

function formatBirthday(value) {
	if (!value) return '';
	return formatDate(value);
}

async function load() {
	if (!personId.value) {
		error.value = Object.assign(new Error('Invalid person id'), { status: 404 });
		loading.value = false;
		return;
	}
	loading.value = true;
	error.value = null;
	try {
		const data = await tmdb.fetchRaw(`/person/${personId.value}`, { append_to_response: 'combined_credits,external_ids' });
		if (!data) {
			error.value = Object.assign(new Error('Person not found'), { status: 404 });
			person.value = null;
			return;
		}
		person.value = data;

		const cast = Array.isArray(data.combined_credits?.cast) ? data.combined_credits.cast : [];
		const cre = Array.isArray(data.combined_credits?.crew) ? data.combined_credits.crew : [];

		const seen = new Set();
		acting.value = cast
			.slice()
			.sort((a, b) => {
				const da = a.release_date || a.first_air_date || '';
				const db = b.release_date || b.first_air_date || '';
				if (db !== da) return db.localeCompare(da);
				return (b.popularity || 0) - (a.popularity || 0);
			})
			.filter((c) => {
				const key = `${c.media_type}-${c.id}`;
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			});

		const seenCrew = new Set();
		crew.value = cre
			.slice()
			.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
			.filter((c) => {
				const key = `${c.media_type}-${c.id}-${c.job}`;
				if (seenCrew.has(key)) return false;
				seenCrew.add(key);
				return true;
			});

		if (acting.value.length === 0 && crew.value.length > 0) activeTab.value = 'crew';
		else activeTab.value = 'acting';
	} catch (err) {
		error.value = err;
		person.value = null;
	} finally {
		loading.value = false;
	}
}

watch(
	person,
	(value) => {
		if (!value?.name) return;
		const knownFor = value.known_for_department ? ` — ${value.known_for_department}` : '';
		const description = value.biography || `Filmography and profile for ${value.name}${knownFor} on ViewVerse.`;
		const image = tmdbShareImage(value.profile_path, 'h632');
		useHead({
			title: `${value.name}. ViewVerse`,
			meta: shareHeadMeta({
				title: `${value.name}${knownFor} | ViewVerse`,
				description,
				path: `/person/${value.id}`,
				image,
				type: 'profile',
			}),
		});
	},
	{ immediate: true },
);

async function refresh() {
	await load();
}

await load();

function goBack() {
	if (typeof window !== 'undefined' && window.history.length > 1) {
		router.back();
		return;
	}
	router.push('/');
}
</script>

<template>
	<div v-if="loading" class="person-page person-page--loading">
		<div class="person-page__skeleton-portrait">
			<Skeleton width="100%" height="100%" rounded="none" />
		</div>
		<div class="person-page__skeleton-body">
			<Skeleton width="50%" height="44px" rounded="none" />
			<Skeleton width="80%" height="14px" rounded="none" />
			<Skeleton width="92%" height="14px" rounded="none" />
			<Skeleton width="86%" height="14px" rounded="none" />
		</div>
	</div>

	<ErrorState v-else-if="error" :title="error.status === 404 ? 'Person not found' : 'Unable to load content'" :message="error.status === 404 ? 'We could not find this person.' : 'Please try again.'" @retry="refresh" />

	<div v-else-if="!person" />

	<div v-else class="person-page">
		<div class="person-page__back-wrap">
			<BackButton :to="`#`" label="Back" @click.prevent="goBack" />
		</div>

		<div class="person-page__layout">
			<div class="person-page__portrait">
				<TmdbImage :src="portraitSrc" :alt="person.name || ''" ratio="1/1" rounded="sm" />
			</div>

			<div class="person-page__main">
				<h1 class="person-page__name">{{ person.name }}</h1>

				<p v-if="person.biography" class="person-page__bio">{{ person.biography }}</p>
				<p v-else class="person-page__bio person-page__bio--empty">No biography available yet.</p>

				<dl class="person-page__facts">
					<div v-if="person.known_for_department" class="person-page__fact">
						<dt>Known for</dt>
						<dd>{{ person.known_for_department }}</dd>
					</div>
					<div v-if="person.birthday" class="person-page__fact">
						<dt>Born</dt>
						<dd>
							{{ formatBirthday(person.birthday) }}<span v-if="ageYears" class="person-page__fact-age"> · {{ ageYears }} years old</span>
						</dd>
					</div>
					<div v-if="person.place_of_birth" class="person-page__fact">
						<dt>Place of birth</dt>
						<dd>{{ person.place_of_birth }}</dd>
					</div>
					<div v-if="person.gender !== undefined && person.gender !== null" class="person-page__fact">
						<dt>Gender</dt>
						<dd>{{ genderLabel }}</dd>
					</div>
					<div v-if="castCount > 0 || crewCount > 0" class="person-page__fact">
						<dt>Credits</dt>
						<dd>{{ creditsLine }}</dd>
					</div>
					<div v-if="popularMovieTitle" class="person-page__fact">
						<dt>Best known for</dt>
						<dd>{{ popularMovieTitle }}</dd>
					</div>
					<div v-if="person.deathday" class="person-page__fact">
						<dt>Date of death</dt>
						<dd>{{ formatBirthday(person.deathday) }}</dd>
					</div>
					<div v-if="popularity" class="person-page__fact">
						<dt>Popularity</dt>
						<dd>{{ popularity }}</dd>
					</div>
				</dl>
			</div>
		</div>

		<nav class="person-page__tabs" aria-label="Sections">
			<button v-for="tab in availableTabs" :key="tab.value" type="button" class="person-page__tab" :class="{ 'is-active': activeTab === tab.value }" @click="activeTab = tab.value">
				<span class="person-page__tab-label">{{ tab.label }}</span>
				<span class="person-page__tab-count">{{ tab.count }}</span>
			</button>
		</nav>

		<section v-if="activeTab === 'acting'" class="person-page__section" aria-labelledby="acting-heading">
			<ul v-if="actingCredits.length > 0" class="person-page__crew-list">
				<li v-for="credit in actingCredits" :key="`acting-${credit.id}-${credit.media_type}`" class="person-page__crew-item-wrap">
					<NuxtLink :to="creditLink(credit)" class="person-page__crew-item" :aria-label="`Open ${credit.title || 'title'}`">
						<div class="person-page__crew-poster">
							<TmdbImage :src="actingPoster(credit)" :alt="credit.title" ratio="2/3" rounded="sm" />
						</div>
						<div class="person-page__crew-body">
							<p class="person-page__crew-title">{{ credit.title }}</p>
							<p class="person-page__crew-job">
								{{ credit.character || '' }}<span v-if="credit.year" class="person-page__crew-year"> {{ credit.year }}</span>
							</p>
						</div>
					</NuxtLink>
				</li>
			</ul>

			<EmptyState v-else icon="film" title="No acting credits" message="We don't have any acting credits for this person yet." />
		</section>

		<section v-else-if="activeTab === 'crew'" class="person-page__section" aria-labelledby="crew-heading">
			<ul v-if="crewCredits.length > 0" class="person-page__crew-list">
				<li v-for="credit in crewCredits" :key="credit.key" class="person-page__crew-item-wrap">
					<NuxtLink :to="creditLink(credit)" class="person-page__crew-item" :aria-label="`Open ${credit.title || 'title'}`">
						<div class="person-page__crew-poster">
							<TmdbImage :src="credit.poster" :alt="credit.title" ratio="2/3" rounded="sm" />
						</div>
						<div class="person-page__crew-body">
							<p class="person-page__crew-title">{{ credit.title }}</p>
							<p class="person-page__crew-job">
								{{ credit.job }} <span class="person-page__crew-year">{{ credit.year }}</span>
							</p>
						</div>
					</NuxtLink>
				</li>
			</ul>

			<EmptyState v-else icon="list" title="No crew credits" message="We don't have any crew credits for this person yet." />
		</section>
	</div>
</template>

<style scoped>
.person-page {
	display: flex;
	flex-direction: column;
	gap: 0;
	padding-bottom: 80px;
}

.person-page--loading {
	padding: 24px 4vw;
	max-width: var(--layout-max);
	margin: 0 auto;
}

.person-page__back-wrap {
	display: inline-flex;
	margin: 24px auto 0;
	padding: 0 4vw;
	max-width: var(--layout-max);
	width: 100%;
	align-self: flex-start;
}

.person-page__skeleton-portrait {
	max-width: 220px;
	width: 100%;
	aspect-ratio: 1 / 1;
}

.person-page__skeleton-body {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-top: 24px;
}

.person-page__layout {
	display: grid;
	grid-template-columns: 1fr;
	gap: 24px;
	padding: 24px 4vw 0;
	max-width: var(--layout-max);
	margin: 0 auto;
	width: 100%;
}

@media (min-width: 640px) {
	.person-page__layout {
		grid-template-columns: 240px 1fr;
		gap: 32px;
		align-items: start;
	}
}

@media (min-width: 1024px) {
	.person-page__layout {
		grid-template-columns: 300px 1fr;
		gap: 48px;
	}
}

.person-page__portrait {
	max-width: 300px;
	width: 100%;
	margin: 0 auto;
}

@media (min-width: 640px) {
	.person-page__portrait {
		margin: 0;
	}
}

.person-page__main {
	display: flex;
	flex-direction: column;
	gap: 14px;
	min-width: 0;
}

.person-page__name {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.8rem, 4.5vw, 3.2rem);
	font-weight: 500;
	line-height: 1.05;
	letter-spacing: -0.01em;
	color: var(--color-surface-50);
	text-wrap: balance;
}

.person-page__bio {
	margin: 8px 0 0;
	color: var(--color-surface-200);
	font-size: 1rem;
	line-height: 1.65;
	max-width: 64ch;
}

.person-page__bio--empty {
	font-style: normal;
	color: var(--color-surface-500);
}

.person-page__facts {
	margin: 16px 0 0;
	padding-top: 16px;
	border-top: 1px solid var(--color-line);
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 14px 28px;
}

.person-page__fact dt {
	font-family: var(--font-mono);
	font-size: 0.7rem;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--color-surface-500);
}

.person-page__fact dd {
	margin: 4px 0 0;
	color: var(--color-surface-200);
	font-size: 0.88rem;
	line-height: 1.4;
}

.person-page__fact-age {
	color: var(--color-surface-500);
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.78rem;
	margin-left: 2px;
}

.person-page__tabs {
	display: flex;
	flex-wrap: wrap;
	gap: 0;
	margin: 40px auto 0;
	max-width: var(--layout-max);
	padding: 0 4vw;
	width: 100%;
	border-bottom: 1px solid var(--color-line);
}

.person-page__tab {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 12px 18px;
	background-color: transparent;
	color: var(--color-surface-400);
	border: 0;
	font-family: var(--font-sans);
	font-size: 0.82rem;
	font-weight: 500;
	letter-spacing: 0.04em;
	cursor: pointer;
	transition:
		color 500ms ease,
		background-color 500ms ease;
}

.person-page__tab:hover {
	color: var(--color-surface-50);
}

.person-page__tab.is-active {
	color: var(--color-brand);
	box-shadow: inset 0 -2px 0 var(--color-brand);
}

.person-page__tab-label {
	font-weight: 500;
}

.person-page__tab-count {
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.7rem;
	color: var(--color-surface-500);
	letter-spacing: 0.04em;
}

.person-page__tab.is-active .person-page__tab-count {
	color: var(--color-brand);
}

.person-page__section {
	padding: 28px 4vw 0;
	max-width: var(--layout-max);
	margin: 0 auto;
	width: 100%;
}

.person-page__crew-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	grid-template-columns: 1fr;
	gap: 0;
}

@media (min-width: 640px) {
	.person-page__crew-list {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		column-gap: 24px;
	}
}

@media (min-width: 1024px) {
	.person-page__crew-list {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

.person-page__crew-item-wrap {
	list-style: none;
}

.person-page__crew-item {
	display: grid;
	grid-template-columns: 56px 1fr;
	gap: 14px;
	padding: 14px 0;
	border-bottom: 1px solid var(--color-line);
	align-items: center;
	text-decoration: none;
	color: inherit;
	transition: color 500ms ease;
}

.person-page__crew-item:hover .person-page__crew-title {
	color: var(--color-brand);
}

.person-page__crew-poster {
	width: 56px;
}

.person-page__crew-body {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.person-page__crew-title {
	margin: 0;
	font-family: var(--font-sans);
	font-size: 0.92rem;
	font-weight: 500;
	color: var(--color-surface-50);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.person-page__crew-job {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.72rem;
	color: var(--color-surface-400);
	letter-spacing: 0.04em;
}

.person-page__crew-year {
	color: var(--color-surface-500);
	margin-left: 6px;
}
</style>
