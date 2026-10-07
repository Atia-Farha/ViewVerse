<script setup>
import { computed } from 'vue';

const props = defineProps({
	text: { type: [String, Number], default: '' },
	variant: {
		type: String,
		default: 'default',
		validator: (v) => ['default', 'brand', 'subtle', 'rating'].includes(v),
	},
});

const hasContent = computed(() => props.text !== '' && props.text !== null && props.text !== undefined);
</script>

<template>
	<span v-if="hasContent" class="badge" :class="`badge--${variant}`">
		<slot>{{ text }}</slot>
	</span>
</template>

<style scoped>
.badge {
	display: inline-flex;
	align-items: center;
	padding: 3px 9px;
	font-family: var(--font-sans);
	font-size: 0.7rem;
	font-weight: 500;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	border-radius: 0;
	border: 1px solid transparent;
}

.badge--default {
	background-color: transparent;
	color: var(--color-surface-200);
	border-color: var(--color-line);
}

.badge--brand {
	background-color: var(--color-brand);
	color: var(--color-brand-ink);
	border-color: var(--color-brand);
}

.badge--subtle {
	background-color: transparent;
	color: var(--color-surface-400);
	border-color: transparent;
}

.badge--rating {
	background-color: transparent;
	color: var(--color-brand);
	border-color: var(--color-brand);
}
</style>
