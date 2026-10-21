<script setup>
const props = defineProps({
	title: { type: String, default: 'Something went wrong' },
	message: { type: String, default: 'Unable to load content. Please check your connection and try again.' },
	showRetry: { type: Boolean, default: true },
});

defineEmits(['retry']);

const displayTitle = computed(() => props.title?.trim() || 'Something went wrong');

const displayMessage = computed(() => {
	const raw = props.message?.trim();
	if (!raw) return 'Unable to load content. Please check your connection and try again.';
	if (raw.toLowerCase() === displayTitle.value.toLowerCase()) {
		return 'Unable to load content. Please check your connection and try again.';
	}
	return raw;
});
</script>

<template>
	<div class="error-state" role="alert">
		<span class="error-state__rule" aria-hidden="true" />
		<div class="error-state__icon" aria-hidden="true">
			<svg viewBox="0 0 24 24" width="36" height="36">
				<path fill="none" stroke="currentColor" stroke-width="1.25" d="M12 3 2 21h20" />
				<line x1="12" y1="10" x2="12" y2="15" stroke="currentColor" stroke-width="1.25" />
				<circle cx="12" cy="18" r="0.5" fill="currentColor" />
			</svg>
		</div>
		<h3 class="error-state__title">
			{{ displayTitle }}
		</h3>
		<p class="error-state__message">
			{{ displayMessage }}
		</p>
		<Button v-if="showRetry" variant="primary" size="md" @click="$emit('retry')">Try again</Button>
	</div>
</template>

<style scoped>
.error-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12px;
	padding: 64px 16px;
	text-align: center;
	color: var(--color-surface-200);
}

.error-state__rule {
	width: 40px;
	height: 1px;
	background-color: var(--color-warning);
	margin-bottom: 8px;
}

.error-state__icon {
	color: var(--color-warning);
}

.error-state__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.2rem;
	font-weight: 500;
	color: var(--color-surface-50);
}

.error-state__message {
	max-width: 36rem;
	margin: 0;
	font-size: 0.9rem;
	line-height: 1.5;
	color: var(--color-surface-400);
}
</style>
