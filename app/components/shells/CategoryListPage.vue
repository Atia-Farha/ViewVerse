<script setup>
defineProps({
	title: { type: String, required: true },
	subtitle: { type: String, default: null },
	tabs: { type: Array, default: () => [] },
});
</script>

<template>
	<div class="page-shell category-list-page">
		<header class="category-list-page__header">
			<h1 class="t-display-2 category-list-page__title">{{ title }}</h1>
			<p v-if="subtitle" class="t-meta category-list-page__subtitle">{{ subtitle }}</p>
			<nav v-if="tabs.length" class="category-list-page__tabs" aria-label="Category">
				<NuxtLink v-for="tab in tabs" :key="tab.to" :to="tab.to" class="category-list-page__tab" :active-class="'is-active'">
					<span class="category-list-page__tab-text">{{ tab.label }}</span>
					<span class="category-list-page__tab-rule" aria-hidden="true" />
				</NuxtLink>
			</nav>
		</header>

		<slot />
	</div>
</template>

<style scoped>
.category-list-page__header {
	margin-bottom: 32px;
	padding-bottom: 18px;
}

.category-list-page__title {
	margin: 0;
}

.category-list-page__subtitle {
	margin: 8px 0 0;
}

.category-list-page__tabs {
	display: flex;
	flex-wrap: wrap;
	gap: 24px;
	margin-top: 8px;
	padding-bottom: 0;
	border-bottom: 1px solid var(--color-line);
}

.category-list-page__tab {
	position: relative;
	display: inline-block;
	padding: 10px 0 14px;
	color: var(--color-surface-400);
	font-family: var(--font-sans);
	font-size: 0.78rem;
	font-weight: 500;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	text-decoration: none;
	transition: color 500ms ease;
}

.category-list-page__tab:hover {
	color: var(--color-surface-50);
}

.category-list-page__tab.is-active {
	color: var(--color-surface-50);
}

.category-list-page__tab-rule {
	position: absolute;
	left: 0;
	right: 0;
	bottom: -1px;
	height: 2px;
	background-color: var(--color-brand);
	transform: scaleX(0);
	transform-origin: left center;
	transition: transform 500ms ease;
}

.category-list-page__tab.is-active .category-list-page__tab-rule {
	transform: scaleX(1);
}
</style>
