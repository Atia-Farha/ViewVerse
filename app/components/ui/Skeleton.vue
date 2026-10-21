<script setup>
const props = defineProps({
	width: { type: [String, Number], default: '100%' },
	height: { type: [String, Number], default: '100%' },
	rounded: { type: String, default: 'none' },
});

const style = computed(() => {
	const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
	const h = typeof props.height === 'number' ? `${props.height}px` : props.height;
	return {
		width: w,
		height: h,
		borderRadius: props.rounded === 'full' ? '9999px' : props.rounded === 'lg' ? '4px' : props.rounded === 'sm' ? '2px' : '0',
	};
});
</script>

<template>
	<div class="skeleton" :style="style" :aria-hidden="true" />
</template>
