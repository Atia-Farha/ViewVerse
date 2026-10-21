<script setup>
defineProps({
	title: { type: String, default: '' },
	subtitle: { type: String, default: '' },
});

defineEmits(['back']);
</script>

<template>
	<div class="watch-shell watch-page">
		<header class="watch-page__bar">
			<BackButton :to="`#`" label="Back" @click.prevent="$emit('back')" />
			<div v-if="title || subtitle" class="watch-page__heading">
				<h1 v-if="title" class="watch-page__title">{{ title }}</h1>
				<p v-if="subtitle" class="watch-page__subtitle">{{ subtitle }}</p>
			</div>
		</header>

		<slot />
	</div>
</template>

<style scoped>
.watch-page {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding-top: 40px;
}

.watch-page__bar {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
	padding-bottom: 16px;
}

.watch-page__heading {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.watch-page__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.4rem, 3vw, 2.2rem);
	font-weight: 500;
	line-height: 1.15;
	letter-spacing: 0;
	color: var(--color-surface-50);
}

.watch-page__subtitle {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.72rem;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--color-surface-500);
}
</style>
