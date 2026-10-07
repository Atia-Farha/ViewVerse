<script setup>
defineProps({
	item: { type: Object, default: null },
});
</script>

<template>
	<MediaCard :item="item" media-type="tv" />
</template>
