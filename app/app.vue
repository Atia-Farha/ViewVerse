<script setup>
onMounted(() => {
	const { hydrate } = useWhitelist();
	hydrate();
});
</script>

<template>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>
