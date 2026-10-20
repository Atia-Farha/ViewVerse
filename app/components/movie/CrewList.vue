<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
	crew: { type: Array, default: () => [] },
});

const FEATURED_DEPARTMENTS = ['Directing', 'Writing', 'Camera', 'Editing', 'Art', 'Sound', 'Costume & Make-Up', 'Visual Effects', 'Production', 'Crew', 'Lighting'];

const expanded = ref(false);

const totalCount = computed(() => props.crew.length);

const groups = computed(() => {
	if (!Array.isArray(props.crew) || props.crew.length === 0) return [];

	const buckets = new Map();
	for (const person of props.crew) {
		const dept = person.department || 'Other';
		if (!buckets.has(dept)) buckets.set(dept, []);
		buckets.get(dept).push(person);
	}

	for (const people of buckets.values()) {
		people.sort((a, b) => {
			const aj = (a.job || '').toLowerCase();
			const bj = (b.job || '').toLowerCase();
			if (aj !== bj) return aj.localeCompare(bj);
			return (a.name || '').localeCompare(b.name || '');
		});
	}

	const featured = [];
	for (const dept of FEATURED_DEPARTMENTS) {
		if (buckets.has(dept)) {
			featured.push({ department: dept, people: buckets.get(dept), minor: false });
		}
	}
	const remaining = [...buckets.entries()].filter(([dept]) => !FEATURED_DEPARTMENTS.includes(dept)).sort((a, b) => a[0].localeCompare(b[0]));
	for (const [dept, people] of remaining) {
		featured.push({ department: dept, people, minor: true });
	}
	return featured;
});

function personKey(person) {
	return `${person.id || ''}-${person.credit_id || person.job || ''}`;
}
</script>

<template>
	<section v-if="groups.length > 0" class="credits">
		<button type="button" class="credits__head" :aria-expanded="expanded" aria-controls="credits-body" @click="expanded = !expanded">
			<span class="t-h2 credits__title">Credits</span>
			<span class="credits__count">{{ totalCount }}</span>
			<svg viewBox="0 0 24 24" aria-hidden="true" class="credits__chevron" :class="{ 'credits__chevron--open': expanded }">
				<path fill="none" stroke="currentColor" stroke-width="1.25" d="m6 9 6 6 6-6" />
			</svg>
		</button>

		<div v-show="expanded" id="credits-body" class="credits__body">
			<article v-for="group in groups" :key="group.department" class="credits__group" :class="{ 'credits__group--minor': group.minor }">
				<header class="credits__group-head">
					<h3 class="credits__department">{{ group.department }}</h3>
					<span class="credits__department-count">{{ group.people.length }}</span>
				</header>

				<dl v-if="!group.minor" class="credits__table">
					<div v-for="row in group.people" :key="personKey(row)" class="credits__row">
						<dt class="credits__role">{{ row.job || group.department }}</dt>
						<dd class="credits__name">
							<NuxtLink v-if="row.id" :to="`/person/${row.id}`" class="credits__link" :aria-label="`Open ${row.name || 'person'}`">
								<span class="credits__name-text">{{ row.name }}</span>
							</NuxtLink>
							<span v-else class="credits__name-text">{{ row.name }}</span>
						</dd>
					</div>
				</dl>

				<p v-else class="credits__minor">
					<span v-for="(row, idx) in group.people" :key="personKey(row)" class="credits__minor-item">
						<NuxtLink v-if="row.id" :to="`/person/${row.id}`" class="credits__minor-link" :aria-label="`Open ${row.name || 'person'}`">
							{{ row.name }}
						</NuxtLink>
						<span v-else>{{ row.name }}</span>
						<span v-if="row.job" class="credits__minor-job">, {{ row.job }}</span>
						<span v-if="idx < group.people.length - 1" class="credits__minor-sep" aria-hidden="true">·</span>
					</span>
				</p>
			</article>
		</div>
	</section>
</template>

<style scoped>
.credits {
	padding: 56px 0 0;
}

.credits__head {
	display: flex;
	align-items: center;
	gap: 14px;
	width: calc(100% - 8vw);
	margin: 0 4vw;
	padding: 0 0 10px;
	background: transparent;
	border: 0;
	border-bottom: 1px solid var(--color-line);
	color: var(--color-surface-50);
	font-family: var(--font-sans);
	cursor: pointer;
	text-align: left;
	transition: border-color 500ms ease;
}

.credits__head:hover {
	border-bottom-color: var(--color-brand);
}

.credits__count {
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.7rem;
	color: var(--color-surface-500);
	letter-spacing: 0.06em;
}

.credits__chevron {
	width: 12px;
	height: 12px;
	margin-left: auto;
	color: var(--color-surface-400);
	transition: transform 500ms ease;
}

.credits__chevron--open {
	transform: rotate(180deg);
}

.credits__body {
	display: flex;
	flex-direction: column;
	padding: 28px 4vw 0;
	max-width: var(--layout-max);
	margin: 0 auto;
}

.credits__group {
	display: grid;
	grid-template-columns: 1fr;
	gap: 10px;
	padding: 22px 0 26px;
	border-bottom: 1px solid var(--color-line);
}

.credits__group:first-child {
	padding-top: 0;
}

.credits__group:last-child {
	border-bottom: 0;
}

.credits__group-head {
	display: flex;
	align-items: baseline;
	gap: 14px;
}

.credits__department {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.7rem;
	font-weight: 500;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand);
}

.credits__department-count {
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.66rem;
	color: var(--color-surface-500);
	letter-spacing: 0.06em;
}

.credits__table {
	margin: 0;
	display: flex;
	flex-direction: column;
}

.credits__row {
	display: grid;
	grid-template-columns: minmax(140px, 22%) 1fr;
	gap: 24px;
	align-items: baseline;
	padding: 8px 0;
	border-top: 1px solid var(--color-line);
}

.credits__row:first-child {
	border-top: 0;
}

.credits__role {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.72rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-surface-400);
}

.credits__name {
	margin: 0;
	font-family: var(--font-sans);
	font-size: 0.88rem;
	font-weight: 500;
	line-height: 1.3;
	color: var(--color-surface-50);
	letter-spacing: 0;
}

.credits__link {
	color: inherit;
	text-decoration: none;
	transition: color 500ms ease;
}

.credits__link:hover {
	color: var(--color-brand);
}

.credits__link:focus-visible {
	color: var(--color-brand);
	outline: 2px solid var(--color-brand);
	outline-offset: 4px;
}

.credits__name-text {
	display: inline;
}

.credits__minor {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.78rem;
	line-height: 1.7;
	color: var(--color-surface-200);
	letter-spacing: 0.01em;
	word-spacing: 0.02em;
}

.credits__minor-item {
	display: inline;
}

.credits__minor-link {
	color: var(--color-surface-200);
	text-decoration: none;
	transition: color 500ms ease;
}

.credits__minor-link:hover {
	color: var(--color-brand);
}

.credits__minor-job {
	color: var(--color-surface-500);
}

.credits__minor-sep {
	color: var(--color-surface-700);
	margin: 0 6px;
}

@media (min-width: 768px) {
	.credits__row {
		grid-template-columns: 200px 1fr;
		gap: 28px;
		padding: 8px 0;
	}
}

@media (min-width: 1024px) {
	.credits__row {
		grid-template-columns: 240px 1fr;
		gap: 36px;
	}
}
</style>
