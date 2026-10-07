<script setup></script>

<template>
	<div class="watch-layout">
		<AppHeader />
		<slot />
	</div>
</template>

<style scoped>
.watch-layout {
	min-height: 100dvh;
	background-color: var(--color-bg);
}

.watch-layout > :slotted(*) {
	padding-top: 96px;
}
</style>
