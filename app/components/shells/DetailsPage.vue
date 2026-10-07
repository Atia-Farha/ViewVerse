<script setup>
defineProps({
	backdropPath: { type: String, default: null },
});
</script>

<template>
	<div class="details-page">
		<section class="details-page__hero" :style="{ backgroundImage: backdropPath ? `url(${backdropPath})` : 'none' }">
			<div class="hero-gradient details-page__gradient" />
		</section>
		<div class="details-page__body">
			<slot />
		</div>
	</div>
</template>

<style scoped>
.details-page {
	display: flex;
	flex-direction: column;
	gap: 0;
	padding-bottom: 64px;
}

.details-page__hero {
	position: relative;
	height: 56vh;
	max-height: 640px;
	background-color: var(--color-bg-elevated);
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}

.details-page__gradient {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.details-page__body {
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: 32px 4vw 0;
	max-width: var(--layout-max);
	margin: 0 auto;
	width: 100%;
}
</style>
