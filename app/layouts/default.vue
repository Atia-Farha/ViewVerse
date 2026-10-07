<script setup></script>

<template>
	<div class="app-shell">
		<AppHeader />
		<main class="app-shell__main">
			<slot />
		</main>
		<AppFooter />
	</div>
</template>

<style scoped>
.app-shell {
	display: flex;
	flex-direction: column;
	min-height: 100dvh;
	background-color: var(--color-bg);
}

.app-shell__main {
	flex: 1;
	padding-top: 56px;
}
</style>
