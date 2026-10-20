<script setup>
import { computed } from 'vue';

const props = defineProps({
	id: { type: Number, required: true },
	mediaType: { type: String, required: true },
	title: { type: String, required: true },
	posterPath: { type: [String, null], default: null },
	size: { type: String, default: 'md' },
	showLabel: { type: Boolean, default: true },
});

const { isInList, toggle } = useWhitelist();

const isInListValue = computed(() => isInList(props.id, props.mediaType));

function onToggle() {
	toggle({
		id: props.id,
		media_type: props.mediaType,
		title: props.title,
		poster_path: props.posterPath,
	});
}
</script>

<template>
	<Button :variant="isInListValue ? 'secondary' : 'ghost'" :size="size" :aria-pressed="isInListValue" :aria-label="isInListValue ? 'Remove from My List' : 'Add to My List'" @click="onToggle">
		<template #default>
			<svg viewBox="0 0 24 24" aria-hidden="true" class="whitelist-btn__icon" :class="{ 'is-filled': isInListValue }">
				<path v-if="isInListValue" fill="none" stroke="currentColor" stroke-width="1.25" d="M5 4h14v16l-7-3.5L5 20z" />
				<path v-else fill="none" stroke="currentColor" stroke-width="1.25" d="M12 4v16M4 12h16" />
			</svg>
			<span v-if="showLabel">{{ isInListValue ? 'In My List' : 'My List' }}</span>
		</template>
	</Button>
</template>

<style scoped>
.whitelist-btn__icon {
	width: 18px;
	height: 18px;
	flex-shrink: 0;
	transition: color 500ms ease;
}

.whitelist-btn__icon.is-filled {
	color: var(--color-brand);
}
</style>
