<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
	seasons: { type: Array, default: () => [] },
	modelValue: { type: Number, default: 1 },
});

const emit = defineEmits(['update:modelValue']);

// TMDB returns season 0 as "Specials" — often hundreds of one-off segments
// that would drown out the main list, so it gets its own optgroup.
const playableSeasons = computed(() => props.seasons.filter((s) => typeof s.season_number === 'number' && s.season_number > 0).sort((a, b) => a.season_number - b.season_number));

const specials = computed(() => props.seasons.filter((s) => typeof s.season_number === 'number' && s.season_number === 0).sort((a, b) => a.season_number - b.season_number));

function seasonLabel(season) {
	return season.name || `Season ${season.season_number}`;
}

function episodeLabel(season) {
	return typeof season.episode_count === 'number' ? `${season.episode_count} ep` : null;
}

// Land on a real season rather than Specials when the incoming value is 0/missing.
onMounted(() => {
	const current = props.modelValue;
	const isValid = playableSeasons.value.some((s) => s.season_number === current);
	if (!isValid) {
		const fallback = playableSeasons.value[0]?.season_number ?? specials.value[0]?.season_number ?? 1;
		emit('update:modelValue', fallback);
	}
});

function onChange(event) {
	const value = Number(event.target.value);
	if (!Number.isNaN(value)) {
		emit('update:modelValue', value);
	}
}
</script>

<template>
	<div v-if="seasons.length > 0" class="season-selector">
		<label for="season-select" class="season-selector__label">Season</label>
		<div class="season-selector__select-wrap">
			<select id="season-select" class="season-selector__select" :value="modelValue" @change="onChange">
				<optgroup v-if="playableSeasons.length" label="Seasons">
					<option v-for="season in playableSeasons" :key="season.season_number" :value="season.season_number">{{ seasonLabel(season) }}{{ episodeLabel(season) ? ` · ${episodeLabel(season)}` : '' }}</option>
				</optgroup>
				<optgroup v-if="specials.length" label="Specials">
					<option v-for="season in specials" :key="season.season_number" :value="season.season_number">{{ seasonLabel(season) }}{{ episodeLabel(season) ? ` · ${episodeLabel(season)}` : '' }}</option>
				</optgroup>
			</select>
			<svg viewBox="0 0 24 24" aria-hidden="true" class="season-selector__caret">
				<path fill="currentColor" d="M7 10l5 5 5-5z" />
			</svg>
		</div>
	</div>
</template>

<style scoped>
.season-selector {
	display: flex;
	align-items: center;
	gap: 14px;
	flex-wrap: wrap;
}

.season-selector__label {
	font-family: var(--font-mono);
	font-size: 0.7rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--color-surface-400);
}

.season-selector__select-wrap {
	position: relative;
	display: inline-flex;
	align-items: center;
}

.season-selector__select {
	appearance: none;
	background-color: transparent;
	color: var(--color-surface-50);
	border: 1px solid var(--color-line);
	border-radius: 0;
	padding: 8px 32px 8px 12px;
	font-family: var(--font-sans);
	font-size: 0.85rem;
	cursor: pointer;
	transition:
		border-color 500ms ease,
		color 500ms ease;
}

.season-selector__select:hover {
	border-color: var(--color-brand);
}

.season-selector__select:focus-visible {
	outline: 2px solid var(--color-brand);
	outline-offset: 2px;
}

/* Keep optgroup headers visually quiet so the list still reads as one control. */
.season-selector__select option,
.season-selector__select optgroup {
	background-color: var(--color-bg-elevated);
	color: var(--color-surface-100);
	font-family: var(--font-sans);
}

.season-selector__caret {
	position: absolute;
	right: 8px;
	width: 14px;
	height: 14px;
	pointer-events: none;
	color: var(--color-brand);
}
</style>
