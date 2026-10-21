<script setup>
const props = defineProps({
	id: { type: Number, required: true },
	mediaType: { type: String, required: true },
	title: { type: String, required: true },
	posterPath: { type: [String, null], default: null },
	size: { type: String, default: 'md' },
	showLabel: { type: Boolean, default: true },
});

const { isInList, toggle } = useWhitelist();
const toast = useToast();

const isInListValue = computed(() => isInList(props.id, props.mediaType));

function onToggle() {
	const res = toggle({
		id: props.id,
		media_type: props.mediaType,
		title: props.title,
		poster_path: props.posterPath,
	});

	if (res.action === 'added') {
		if (res.ok) {
			if (res.warning === 'storage_failed') {
				toast.warning(`"${props.title}" added to My List, but browser storage limit prevented saving.`);
			} else {
				toast.success(`"${props.title}" added to My List.`);
			}
		} else if (res.error === 'limit') {
			toast.warning('My List is full (500 items). Please remove some titles to add more.');
		} else if (res.error === 'exists') {
			toast.info(`"${props.title}" is already in My List.`);
		} else {
			toast.error('Unable to add to My List.');
		}
	} else if (res.action === 'removed') {
		toast.info(`"${props.title}" removed from My List.`);
	}
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
