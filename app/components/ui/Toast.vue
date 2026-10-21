<script setup>
const { toasts, remove } = useToast();

const icons = {
	success: 'M20 6 9 17l-5-5',
	error: 'M12 3 2 21h20M12 10v5M12 18v.01',
	warning: 'M12 3 2 21h20M12 10v5M12 18v.01',
	info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M12 8v4M12 16v.01',
};
</script>

<template>
	<Teleport to="body">
		<div class="toast-region" aria-live="polite" aria-label="Notifications" role="region">
			<TransitionGroup name="toast" tag="div" class="toast-list">
				<div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast--${toast.type}`" role="status" aria-atomic="true">
					<svg viewBox="0 0 24 24" aria-hidden="true" class="toast__icon">
						<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :d="icons[toast.type] || icons.info" />
					</svg>
					<span class="toast__message">{{ toast.message }}</span>
					<button type="button" class="toast__close" aria-label="Dismiss" @click="remove(toast.id)">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path fill="none" stroke="currentColor" stroke-width="1.5" d="M5 5l14 14M19 5L5 19" />
						</svg>
					</button>
				</div>
			</TransitionGroup>
		</div>
	</Teleport>
</template>

<style scoped>
.toast-region {
	position: fixed;
	bottom: 24px;
	right: 24px;
	z-index: 9999;
	pointer-events: none;
}

.toast-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: flex-end;
}

.toast {
	display: flex;
	align-items: flex-start;
	gap: 10px;
	min-width: 280px;
	max-width: min(420px, calc(100vw - 48px));
	padding: 14px 16px;
	background-color: var(--color-bg-elevated);
	border: 1px solid var(--color-line);
	border-left-width: 3px;
	color: var(--color-surface-50);
	font-family: var(--font-sans);
	font-size: 0.88rem;
	line-height: 1.45;
	pointer-events: all;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.toast--success {
	border-left-color: var(--color-success);
}
.toast--error {
	border-left-color: var(--color-danger);
}
.toast--warning {
	border-left-color: var(--color-warning);
}
.toast--info {
	border-left-color: var(--color-brand);
}

.toast__icon {
	width: 18px;
	height: 18px;
	flex-shrink: 0;
	margin-top: 1px;
}

.toast--success .toast__icon {
	color: var(--color-success);
}
.toast--error .toast__icon {
	color: var(--color-danger);
}
.toast--warning .toast__icon {
	color: var(--color-warning);
}
.toast--info .toast__icon {
	color: var(--color-brand);
}

.toast__message {
	flex: 1;
	min-width: 0;
	color: var(--color-surface-200);
}

.toast__close {
	flex-shrink: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	background: transparent;
	border: 0;
	color: var(--color-surface-500);
	cursor: pointer;
	padding: 0;
	transition: color 300ms ease;
}

.toast__close:hover {
	color: var(--color-surface-200);
}

.toast__close svg {
	width: 14px;
	height: 14px;
}

.toast-enter-active {
	transition:
		opacity 250ms ease,
		transform 250ms ease;
}
.toast-leave-active {
	transition:
		opacity 200ms ease,
		transform 200ms ease;
}
.toast-enter-from {
	opacity: 0;
	transform: translateX(24px);
}
.toast-leave-to {
	opacity: 0;
	transform: translateX(24px);
}
</style>
