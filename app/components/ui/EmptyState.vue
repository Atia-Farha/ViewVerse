<script setup>
const props = defineProps({
	title: { type: String, default: 'Nothing here yet' },
	message: { type: String, default: '' },
	icon: {
		type: String,
		default: 'search',
		validator: (v) => ['search', 'bookmark', 'film', 'tv', 'list'].includes(v),
	},
});

const icons = {
	search: 'M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.49-1.49zM9.5 14a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9',
	bookmark: 'M5 4h14v16l-7-3.5L5 20z',
	film: 'M4 4h16v16H4zM4 8h16M4 16h16M8 4v16M12 4v16M16 4v16',
	tv: 'M3 6h18v12H3zM8 22h8',
	list: 'M4 6h16M4 12h16M4 18h10',
};

const iconPath = icons[props.icon] || icons.search;
</script>

<template>
	<div class="empty-state">
		<div class="empty-state__icon" aria-hidden="true">
			<svg viewBox="0 0 24 24" width="36" height="36">
				<path fill="none" stroke="currentColor" stroke-width="1.25" :d="iconPath" />
			</svg>
		</div>
		<h3 class="empty-state__title">
			{{ title }}
		</h3>
		<p v-if="message" class="empty-state__message">
			{{ message }}
		</p>
		<slot />
	</div>
</template>

<style scoped>
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12px;
	padding: 80px 16px;
	text-align: center;
	color: var(--color-surface-200);
}

.empty-state__icon {
	color: var(--color-surface-500);
}

.empty-state__title {
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.2rem;
	font-weight: 500;
	color: var(--color-surface-50);
	letter-spacing: -0.01em;
}

.empty-state__message {
	max-width: 36rem;
	margin: 0;
	font-size: 0.9rem;
	line-height: 1.5;
	color: var(--color-surface-400);
}
</style>
