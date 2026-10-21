<script setup>
import { profileImage } from '~/utils/tmdb.js';

defineProps({
	people: { type: Array, default: () => [] },
	label: { type: String, default: 'Cast' },
});

const scrollerRef = ref(null);

function keyFor(person) {
	return `${person.id || person.credit_id || person.name}`;
}

function profileUrl(person) {
	return profileImage(person.profile_path, 'w185');
}
</script>

<template>
	<section v-if="people.length > 0" class="cast" :aria-label="label">
		<header class="cast__header">
			<h3 class="t-h2 cast__title">
				{{ label }}
			</h3>
		</header>
		<ul ref="scrollerRef" class="cast__list scroll-row">
			<li v-for="person in people" :key="keyFor(person)" class="cast__person-wrap">
				<NuxtLink v-if="person.id" :to="`/person/${person.id}`" class="cast__person" :aria-label="`Open ${person.name || 'person'}`">
					<div class="cast__avatar">
						<TmdbImage :src="profileUrl(person)" :alt="person.name || ''" ratio="2/3" rounded="none" />
					</div>
					<div class="cast__info">
						<p class="cast__name">
							{{ person.name }}
						</p>
						<p v-if="person.character" class="cast__role">
							{{ person.character }}
						</p>
						<p v-else-if="person.job" class="cast__role">
							{{ person.job }}
						</p>
					</div>
				</NuxtLink>
				<div v-else class="cast__person">
					<div class="cast__avatar">
						<TmdbImage :src="profileUrl(person)" :alt="person.name || ''" ratio="2/3" rounded="none" />
					</div>
					<div class="cast__info">
						<p class="cast__name">
							{{ person.name }}
						</p>
						<p v-if="person.character" class="cast__role">
							{{ person.character }}
						</p>
						<p v-else-if="person.job" class="cast__role">
							{{ person.job }}
						</p>
					</div>
				</div>
			</li>
		</ul>
	</section>
</template>

<style scoped>
.cast {
	padding: 24px 4vw 0;
	max-width: var(--layout-max);
	margin: 0 auto;
	width: 100%;
}

.cast__header {
	margin-bottom: 16px;
	padding-bottom: 10px;
	border-bottom: 1px solid var(--color-line);
}

.cast__title {
	margin: 0;
}

.cast__list {
	display: flex;
	gap: 18px;
	overflow-x: auto;
	padding: 4px 0 6px;
	list-style: none;
	margin: 0;
}

.cast__person-wrap {
	flex: 0 0 auto;
	width: 100px;
	list-style: none;
}

.cast__person {
	display: flex;
	flex-direction: column;
	gap: 8px;
	text-decoration: none;
	color: inherit;
	transition: color 500ms ease;
}

a.cast__person:hover .cast__name {
	color: var(--color-brand);
}

.cast__avatar {
	width: 80px;
	filter: grayscale(0.2);
}

.cast__info {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.cast__name {
	margin: 0;
	font-family: var(--font-sans);
	font-size: 0.82rem;
	font-weight: 500;
	color: var(--color-surface-50);
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.cast__role {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.7rem;
	color: var(--color-surface-400);
	letter-spacing: 0.04em;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
