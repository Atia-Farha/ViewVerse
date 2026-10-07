<script setup>
defineProps({
	to: { type: String, required: true },
	label: { type: String, default: 'Back' },
});
</script>

<template>
	<NuxtLink :to="to" class="t-back back-button">
		<svg viewBox="0 0 24 24" aria-hidden="true" class="back-button__icon">
			<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="m15 6-6 6 6 6" />
		</svg>
		<span>{{ label }}</span>
	</NuxtLink>
</template>

<style scoped>
.back-button {
	display: inline-flex;
	align-items: center;
	gap: 6px;
}

.back-button__icon {
	width: 14px;
	height: 14px;
}
</style>
