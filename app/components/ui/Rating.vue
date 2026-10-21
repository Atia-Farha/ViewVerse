<script setup>
import { formatRating } from '~/utils/format.js';

const props = defineProps({
	value: { type: [Number, String], default: null },
	showOnZero: { type: Boolean, default: false },
});

const display = computed(() => {
	const n = typeof props.value === 'string' ? Number(props.value) : props.value;
	if (typeof n !== 'number' || Number.isNaN(n)) return null;
	if (!props.showOnZero && n <= 0) return null;
	return formatRating(n);
});
</script>

<template>
	<span v-if="display !== null" class="rating" :title="`Rated ${display} / 10`">
		<span class="rating__dot" aria-hidden="true">·</span>
		<span class="rating__value">{{ display }}</span>
		<span class="rating__denom" aria-hidden="true">/10</span>
	</span>
</template>

<style scoped>
.rating {
	display: inline-flex;
	align-items: baseline;
	gap: 2px;
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	color: var(--color-brand);
}

.rating__dot {
	opacity: 0.6;
}

.rating__value {
	font-size: 0.85rem;
	font-weight: 500;
}

.rating__denom {
	font-size: 0.65rem;
	color: var(--color-surface-500);
	letter-spacing: 0.06em;
}
</style>
