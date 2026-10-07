<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import { VIDFAST_ORIGINS } from '~/utils/vidfast.js';

const props = defineProps({
	src: { type: String, required: true },
	autoload: { type: Boolean, default: true },
});

const visible = ref(false);
const hasError = ref(false);
const iframeRef = ref(null);

function onLoad() {
	visible.value = true;
	hasError.value = false;
}

function onIframeLoad() {
	hasError.value = false;
}

function retry() {
	hasError.value = false;
	if (iframeRef.value) {
		const original = iframeRef.value.src;
		iframeRef.value.src = '';
		requestAnimationFrame(() => {
			if (iframeRef.value) iframeRef.value.src = original;
		});
	}
}

function handleMessage(event) {
	if (!VIDFAST_ORIGINS.includes(event.origin)) return;
	if (!event.data) return;
	if (event.data.type === 'PLAYER_EVENT' && event.data.data?.event === 'error') {
		hasError.value = true;
	}
}

if (props.autoload) {
	visible.value = true;
}

if (typeof window !== 'undefined') {
	window.addEventListener('message', handleMessage);
}

onBeforeUnmount(() => {
	if (typeof window !== 'undefined') {
		window.removeEventListener('message', handleMessage);
	}
});

watch(
	() => props.src,
	() => {
		hasError.value = false;
	},
);
</script>

<template>
	<div class="video-player">
		<div v-if="!visible" class="video-player__placeholder">
			<div class="video-player__placeholder-inner">
				<p class="video-player__placeholder-eyebrow">Player ready</p>
				<button type="button" class="video-player__load-btn" @click="onLoad">
					<svg viewBox="0 0 24 24" aria-hidden="true" class="video-player__play-icon">
						<path fill="currentColor" d="M8 5v14l11-7z" />
					</svg>
					<span>Press play to start streaming</span>
				</button>
				<p class="video-player__placeholder-note">Streaming provided by VidFast.</p>
			</div>
		</div>
		<div v-else class="video-player__frame">
			<iframe v-if="visible" ref="iframeRef" :src="src" title="VidFast player" frameborder="0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen @load="onIframeLoad" />
			<div v-if="hasError" class="video-player__error" role="alert">
				<p>Unable to load the player. Try again.</p>
				<Button variant="primary" size="md" @click="retry">Retry</Button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.video-player {
	position: relative;
	width: 100%;
	background-color: #000;
	border: 1px solid var(--color-line);
	border-radius: 0;
	overflow: hidden;
}

.video-player__placeholder {
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 9;
	display: flex;
	align-items: center;
	justify-content: center;
	background: radial-gradient(circle at 50% 35%, rgba(240, 180, 41, 0.08) 0%, transparent 55%), var(--color-bg-elevated);
}

.video-player__placeholder-inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 14px;
	text-align: center;
}

.video-player__placeholder-eyebrow {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.72rem;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-surface-500);
}

.video-player__load-btn {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	padding: 14px 28px;
	background-color: var(--color-brand);
	color: var(--color-brand-ink);
	font-family: var(--font-sans);
	font-size: 0.95rem;
	font-weight: 600;
	letter-spacing: 0.02em;
	border: 0;
	border-radius: 0;
	cursor: pointer;
	transition: background-color 160ms ease;
}

.video-player__load-btn:hover {
	background-color: var(--color-brand-hover);
}

.video-player__play-icon {
	width: 22px;
	height: 22px;
}

.video-player__placeholder-note {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.7rem;
	letter-spacing: 0.08em;
	color: var(--color-surface-500);
}

.video-player__frame {
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 9;
}

.video-player__frame iframe {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	border: 0;
}

.video-player__error {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
	justify-content: center;
	color: #fff;
	background-color: rgba(7, 7, 10, 0.92);
}
</style>
