<script setup>
defineProps({
	seasons: { type: Array, default: () => [] },
	modelValue: { type: Number, default: 1 },
});

const emit = defineEmits(['update:modelValue']);

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
				<option v-for="season in seasons" :key="season.season_number" :value="season.season_number">
					{{ season.name || `Season ${season.season_number}` }}
					{{ typeof season.episode_count === 'number' ? `(${season.episode_count} ep)` : '' }}
				</option>
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
		border-color 160ms ease,
		color 160ms ease;
}

.season-selector__select:hover {
	border-color: var(--color-brand);
}

.season-selector__select:focus-visible {
	outline: 2px solid var(--color-brand);
	outline-offset: 2px;
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
