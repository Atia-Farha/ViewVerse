<script setup>
defineProps({
	label: { type: [String, Number], required: true },
	brand: { type: Boolean, default: false },
});
</script>

<template>
	<span class="meta-chip" :class="{ 'meta-chip--brand': brand }">
		{{ label }}
	</span>
</template>

<style scoped>
.meta-chip {
	display: inline-flex;
	align-items: center;
	font-family: var(--font-mono);
	font-feature-settings: 'tnum' 1;
	font-size: 0.78rem;
	letter-spacing: 0.04em;
	color: var(--color-surface-200);
	padding: 4px 10px;
	border: 1px solid var(--color-line);
	border-radius: 0;
}

.meta-chip--brand {
	color: var(--color-brand);
	border-color: var(--color-brand);
}
</style>
