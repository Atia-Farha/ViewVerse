<script setup></script>

<template>
	<div class="watch-layout">
		<AppHeader />
		<main class="watch-layout__main">
			<slot />
		</main>
		<AppFooter />
	</div>
</template>

<style scoped>
.watch-layout {
	display: flex;
	flex-direction: column;
	min-height: 100dvh;
	background-color: var(--color-bg);
}

.watch-layout__main {
	flex: 1;
	padding-top: 96px;
}
</style>
