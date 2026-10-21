<script setup>
const props = defineProps({
	error: { type: Object, default: null },
});

const statusCode = computed(() => Number(props.error?.statusCode) || 404);

const titleText = computed(() => {
	if (statusCode.value === 404) return 'Page Not Found';
	if (statusCode.value === 401 || statusCode.value === 403) return 'Access Restricted';
	if (statusCode.value === 429) return 'Too Many Requests';
	if (statusCode.value >= 500) return 'Server Error';
	return 'Something Went Wrong';
});

const messageText = computed(() => {
	const rawMessage = props.error?.statusMessage || props.error?.message || '';
	const genericPhrases = ['error', 'server error', 'internal server error', 'not found', 'bad request'];

	if (rawMessage && !genericPhrases.includes(rawMessage.trim().toLowerCase()) && rawMessage.trim().toLowerCase() !== titleText.value.toLowerCase()) {
		return rawMessage;
	}

	if (statusCode.value === 404) {
		return "We couldn't find the page, movie, or series you were looking for.";
	}
	if (statusCode.value === 401 || statusCode.value === 403) {
		return 'You do not have permission to access this resource.';
	}
	if (statusCode.value === 429) {
		return 'The TMDB rate limit was exceeded. Please wait a moment and reload.';
	}
	if (statusCode.value === 503 || statusCode.value === 504) {
		return 'The external service is temporarily unavailable. Please try again shortly.';
	}
	if (statusCode.value >= 500) {
		return 'An unexpected server error occurred while processing your request.';
	}
	return 'An unexpected error occurred. Please try again.';
});

function goHome() {
	clearError({ redirect: '/' });
}

function reloadPage() {
	if (typeof window !== 'undefined') {
		clearError();
		window.location.reload();
	} else {
		clearError({ redirect: '/' });
	}
}
</script>

<template>
	<div class="error-page" role="alert">
		<div class="error-page__inner">
			<span class="error-page__rule" aria-hidden="true" />
			<p class="error-page__code">{{ statusCode }}</p>
			<h1 class="error-page__title">{{ titleText }}</h1>
			<p class="error-page__message">{{ messageText }}</p>
			<div class="error-page__actions">
				<Button v-if="statusCode !== 404" variant="secondary" size="lg" @click="reloadPage"> Try again </Button>
				<Button variant="primary" size="lg" @click="goHome"> Back to home </Button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.error-page {
	min-height: 100dvh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32px 24px;
	background-color: var(--color-bg);
}

.error-page__inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	max-width: 520px;
	text-align: center;
}

.error-page__rule {
	width: 48px;
	height: 2px;
	background-color: var(--color-brand);
	margin-bottom: 8px;
}

.error-page__code {
	margin: 0;
	font-family: var(--font-mono);
	font-size: clamp(3.5rem, 10vw, 5.5rem);
	font-weight: 600;
	line-height: 1;
	letter-spacing: -0.03em;
	color: var(--color-brand);
}

.error-page__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.4rem, 3.5vw, 2rem);
	font-weight: 500;
	color: var(--color-surface-50);
	letter-spacing: -0.01em;
}

.error-page__message {
	margin: 0;
	font-family: var(--font-sans);
	font-size: 1rem;
	line-height: 1.6;
	color: var(--color-surface-300);
	max-width: 42ch;
}

.error-page__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	justify-content: center;
	margin-top: 12px;
}
</style>
