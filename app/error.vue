<script setup>
import { computed } from 'vue';

const props = defineProps({
	error: { type: Object, default: null },
});

const messageText = computed(() => {
	if (props.error?.statusCode === 404) {
		return "We couldn't find the page you were looking for.";
	}
	return 'Something unexpected happened.';
});

function goHome() {
	clearError({ redirect: '/' });
}
</script>

<template>
	<div class="error-page">
		<div class="error-page__inner">
			<span class="error-page__rule" aria-hidden="true" />
			<h1 class="error-page__code">{{ error?.statusCode || 404 }}</h1>
			<p class="error-page__message">{{ messageText }}</p>
			<Button variant="primary" size="lg" @click="goHome">Take me home</Button>
		</div>
	</div>
</template>

<style scoped>
.error-page {
	min-height: 100dvh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	background-color: var(--color-bg);
}

.error-page__inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	max-width: 480px;
	text-align: center;
}

.error-page__rule {
	width: 60px;
	height: 1px;
	background-color: var(--color-brand);
	margin-bottom: 12px;
}

.error-page__code {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(4rem, 12vw, 6rem);
	font-weight: 500;
	line-height: 1.1;
	letter-spacing: -0.02em;
	color: var(--color-brand);
}

.error-page__message {
	margin: 0;
	font-family: var(--font-display);
	font-style: italic;
	font-size: 1.1rem;
	color: var(--color-surface-200);
}
</style>
