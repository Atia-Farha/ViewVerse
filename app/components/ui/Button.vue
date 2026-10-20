<script setup>
const props = defineProps({
	variant: {
		type: String,
		default: 'primary',
		validator: (v) => ['primary', 'secondary', 'ghost', 'icon', 'danger'].includes(v),
	},
	size: {
		type: String,
		default: 'md',
		validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
	},
	type: { type: String, default: 'button' },
	disabled: { type: Boolean, default: false },
	loading: { type: Boolean, default: false },
	block: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);

function onClick(event) {
	if (props.disabled || props.loading) return;
	emit('click', event);
}
</script>

<template>
	<button :type="type" class="btn" :class="[`btn--${variant}`, `btn--${size}`, { 'btn--loading': loading, 'btn--block': block }]" :disabled="disabled || loading" :aria-busy="loading || null" @click="onClick">
		<span v-if="!loading" class="btn__content">
			<slot />
		</span>
		<span v-else class="btn__spinner" aria-hidden="true" />
	</button>
</template>

<style scoped>
.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	font-family: var(--font-sans);
	font-weight: 600;
	letter-spacing: 0.02em;
	border-radius: 0;
	border: 1px solid transparent;
	cursor: pointer;
	transition:
		background-color 500ms ease,
		color 500ms ease,
		transform 500ms ease,
		border-color 500ms ease,
		opacity 500ms ease;
	user-select: none;
	white-space: nowrap;
}

.btn:disabled {
	cursor: not-allowed;
	opacity: 0.45;
}

.btn:active:not(:disabled) {
	transform: scale(0.985);
}

.btn--block {
	width: 100%;
}

.btn--sm {
	padding: 6px 12px;
	font-size: 0.78rem;
}

.btn--md {
	padding: 8px 16px;
	font-size: 0.85rem;
}

.btn--lg {
	padding: 10px 20px;
	font-size: 0.92rem;
}

.btn--xl {
	padding: 13px 26px;
	font-size: 0.95rem;
}

.btn--primary {
	background-color: var(--color-brand);
	color: var(--color-brand-ink);
	border-color: var(--color-brand);
}

.btn--primary:hover:not(:disabled) {
	background-color: var(--color-brand-hover);
	border-color: var(--color-brand-hover);
}

.btn--secondary {
	background-color: transparent;
	color: var(--color-surface-50);
	border-color: var(--color-line);
}

.btn--secondary:hover:not(:disabled) {
	color: var(--color-brand);
	border-color: var(--color-brand);
}

.btn--ghost {
	background-color: transparent;
	color: var(--color-surface-200);
}

.btn--ghost:hover:not(:disabled) {
	color: var(--color-brand);
	background-color: rgba(240, 180, 41, 0.06);
}

.btn--danger {
	background-color: var(--color-danger);
	color: #fff;
	border-color: var(--color-danger);
}

.btn--icon {
	width: 40px;
	height: 40px;
	padding: 0;
	background-color: transparent;
	color: var(--color-surface-200);
	border: 1px solid var(--color-line);
}

.btn--icon:hover:not(:disabled) {
	color: var(--color-brand);
	border-color: var(--color-brand);
}

.btn__content {
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.btn__spinner {
	width: 14px;
	height: 14px;
	border-radius: 50%;
	border: 2px solid currentColor;
	border-top-color: transparent;
	animation: btn-spin 0.7s linear infinite;
}

@keyframes btn-spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
