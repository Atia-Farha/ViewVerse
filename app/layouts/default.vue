<script setup>
const { success: toastSuccess, warning: toastWarning } = useToast();

function onOffline() {
	toastWarning('You appear to be offline. Some content may not load.');
}

function onOnline() {
	toastSuccess('Back online. Connection restored.');
}

onMounted(() => {
	window.addEventListener('offline', onOffline);
	window.addEventListener('online', onOnline);
});

onBeforeUnmount(() => {
	window.removeEventListener('offline', onOffline);
	window.removeEventListener('online', onOnline);
});
</script>

<template>
	<div class="app-shell">
		<AppHeader />
		<main class="app-shell__main">
			<slot />
		</main>
		<AppFooter />
		<Toast />
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
