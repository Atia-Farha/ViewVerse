<script setup>
defineProps({
	facts: {
		type: Array,
		required: true,
		validator: (arr) => Array.isArray(arr),
	},
});
</script>

<template>
	<dl v-if="facts.length" class="media-facts">
		<div v-for="fact in facts" :key="fact.label" v-show="fact.value" class="media-facts__row">
			<dt class="t-eyebrow media-facts__label">{{ fact.label }}</dt>
			<dd class="media-facts__value">{{ fact.value }}</dd>
		</div>
	</dl>
</template>

<style scoped>
.media-facts {
	margin: 20px 0 0;
	padding-top: 20px;
	border-top: 1px solid var(--color-line);
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 14px 28px;
}

.media-facts__row {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.media-facts__label {
	margin: 0;
}

.media-facts__value {
	margin: 0;
	color: var(--color-surface-200);
	font-size: 0.88rem;
	line-height: 1.4;
}
</style>
