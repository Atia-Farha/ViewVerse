<script setup>
import { CINESRC_ORIGIN } from '~/utils/cinesrc.js';
import { VIDFAST_ORIGINS } from '~/utils/vidfast.js';
import { SCREENSCAPE_ORIGIN } from '~/utils/screenscape.js';

const PROVIDERS = [
	{ id: 'cinesrc', label: 'CineSrc' },
	{ id: 'vidfast', label: 'VidFast' },
	{ id: 'screenscape', label: 'ScreenScape' },
];

const AUTO_CHAIN = ['cinesrc', 'vidfast', 'screenscape'];

const ALLOWED_ORIGINS = [CINESRC_ORIGIN, ...VIDFAST_ORIGINS, SCREENSCAPE_ORIGIN];

const props = defineProps({
	src: { type: String, required: true },
	fallbackSrc: { type: String, default: '' },
	screenscapeSrc: { type: String, default: '' },
	autoload: { type: Boolean, default: true },
});

const visible = ref(false);
const hasError = ref(false);
const errorMsg = ref('');
const iframeRef = ref(null);
const isPlaying = ref(false);

const toast = useToast();
const LOAD_TIMEOUT_MS = 30000;
let loadTimeoutTimer = null;

const mode = ref('auto');
const activeProvider = ref('cinesrc');

function srcForProvider(id) {
	if (id === 'cinesrc') return props.src;
	if (id === 'vidfast') return props.fallbackSrc;
	if (id === 'screenscape') return props.screenscapeSrc;
	return '';
}

function isSafeUrl(raw) {
	if (typeof raw !== 'string' || !raw) return false;
	let url;
	try {
		url = new URL(raw);
	} catch {
		return false;
	}
	return url.protocol === 'https:' && ALLOWED_ORIGINS.includes(url.origin);
}

const activeSrc = computed(() => srcForProvider(activeProvider.value));
const safeSrc = computed(() => (isSafeUrl(activeSrc.value) ? activeSrc.value : ''));
const isBlockedSrc = computed(() => Boolean(activeSrc.value) && !safeSrc.value);

function clearLoadTimer() {
	if (loadTimeoutTimer) {
		clearTimeout(loadTimeoutTimer);
		loadTimeoutTimer = null;
	}
}

function startLoadTimer() {
	clearLoadTimer();
	if (typeof window === 'undefined') return;
	if (!visible.value || !activeSrc.value || hasError.value) return;

	isPlaying.value = false;
	loadTimeoutTimer = setTimeout(() => {
		if (!isPlaying.value && !hasError.value && visible.value) {
			const label = PROVIDERS.find((p) => p.id === activeProvider.value)?.label || 'Current source';
			toast.warning(`${label} is taking longer than usual to load. Try switching to another source above.`, { duration: 0 });
		}
	}, LOAD_TIMEOUT_MS);
}

function markPlaybackStarted() {
	isPlaying.value = true;
	clearLoadTimer();
}

function onLoad() {
	visible.value = true;
	hasError.value = false;
	errorMsg.value = '';
	startLoadTimer();
}

function onIframeLoad() {
	hasError.value = false;
	errorMsg.value = '';
}

function selectProvider(id) {
	if (id === activeProvider.value && mode.value === id) return;
	mode.value = id;
	activeProvider.value = id;
	hasError.value = false;
	errorMsg.value = '';
}

function retry() {
	hasError.value = false;
	errorMsg.value = '';
	if (mode.value === 'auto') {
		activeProvider.value = 'cinesrc';
	}
	startLoadTimer();
	if (iframeRef.value) {
		const original = iframeRef.value.src;
		iframeRef.value.src = '';
		requestAnimationFrame(() => {
			if (iframeRef.value) iframeRef.value.src = original;
		});
	}
}

function tryNextInChain() {
	const idx = AUTO_CHAIN.indexOf(activeProvider.value);
	for (let i = idx + 1; i < AUTO_CHAIN.length; i++) {
		const next = AUTO_CHAIN[i];
		if (srcForProvider(next)) {
			activeProvider.value = next;
			hasError.value = false;
			errorMsg.value = '';
			return true;
		}
	}

	clearLoadTimer();
	hasError.value = true;
	errorMsg.value = 'All streaming sources failed. Please try again later or choose another source above.';
	return false;
}

function handleFailure(providerId, defaultLabel) {
	clearLoadTimer();
	const label = PROVIDERS.find((p) => p.id === providerId)?.label || defaultLabel;
	if (mode.value !== 'auto') {
		hasError.value = true;
		errorMsg.value = `${label} failed to load this title. Please try another source above.`;
	} else {
		tryNextInChain();
	}
}

function onIframeError() {
	handleFailure(activeProvider.value, 'Source');
}

function handleMessage(event) {
	if (!ALLOWED_ORIGINS.includes(event.origin)) return;
	if (!event.data) return;

	if (event.data.type === 'cinesrc:play' || event.data.type === 'cinesrc:timeupdate') {
		markPlaybackStarted();
		return;
	}

	if (event.data.type === 'PLAYER_EVENT' && (event.data.data?.event === 'play' || event.data.data?.event === 'timeupdate')) {
		markPlaybackStarted();
		return;
	}

	if (event.data.type === 'cinesrc:error') {
		handleFailure('cinesrc', 'CineSrc');
		return;
	}

	if (event.data.type === 'PLAYER_EVENT' && event.data.data?.event === 'error') {
		handleFailure('vidfast', 'VidFast');
		return;
	}

	if (event.origin === SCREENSCAPE_ORIGIN && (event.data.type === 'SCREENSCAPE_ERROR' || event.data.error || event.data.type === 'error')) {
		handleFailure('screenscape', 'ScreenScape');
		return;
	}
}

if (props.autoload) visible.value = true;

onMounted(() => {
	if (visible.value && activeSrc.value) {
		startLoadTimer();
	}
});

if (typeof window !== 'undefined') {
	window.addEventListener('message', handleMessage);
}

onBeforeUnmount(() => {
	clearLoadTimer();
	if (typeof window !== 'undefined') {
		window.removeEventListener('message', handleMessage);
	}
});

watch(activeSrc, (newSrc) => {
	if (newSrc && visible.value) {
		startLoadTimer();
	} else {
		clearLoadTimer();
	}
});

watch(
	() => props.src,
	() => {
		hasError.value = false;
		errorMsg.value = '';
		mode.value = 'auto';
		activeProvider.value = 'cinesrc';
		isPlaying.value = false;
	},
);
</script>

<template>
	<div class="video-player">
		<div class="video-player__source-bar">
			<span class="video-player__source-label">Source</span>
			<div class="video-player__source-btns" role="group" aria-label="Streaming source">
				<button v-for="p in PROVIDERS" :key="p.id" type="button" class="video-player__source-btn" :class="{ 'video-player__source-btn--active': activeProvider === p.id }" :aria-pressed="activeProvider === p.id" @click="selectProvider(p.id)">
					{{ p.label }}
				</button>
			</div>
		</div>

		<div v-if="isBlockedSrc" class="video-player__placeholder">
			<div class="video-player__placeholder-inner">
				<p class="video-player__placeholder-eyebrow">Player unavailable</p>
				<p class="video-player__placeholder-note">This source isn't allowed.</p>
			</div>
		</div>

		<div v-else-if="!visible" class="video-player__placeholder">
			<div class="video-player__placeholder-inner">
				<p class="video-player__placeholder-eyebrow">Player ready</p>
				<button type="button" class="video-player__load-btn" @click="onLoad">
					<svg viewBox="0 0 24 24" aria-hidden="true" class="video-player__play-icon">
						<path fill="currentColor" d="M8 5v14l11-7z" />
					</svg>
					<span>Press play to start streaming</span>
				</button>
				<p class="video-player__placeholder-note">Streaming via CineSrc · VidFast · ScreenScape</p>
			</div>
		</div>

		<div v-else class="video-player__frame">
			<iframe v-if="visible" ref="iframeRef" :src="safeSrc" title="Video player" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen @load="onIframeLoad" @error="onIframeError" />
			<div v-if="hasError" class="video-player__error" role="alert">
				<p>{{ errorMsg || 'Unable to load the player. Try again.' }}</p>
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

.video-player__source-bar {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 8px 12px;
	background-color: rgba(7, 7, 10, 0.88);
	border-bottom: 1px solid var(--color-line);
}

.video-player__source-label {
	font-family: var(--font-mono);
	font-size: 0.65rem;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-surface-500);
	white-space: nowrap;
	flex-shrink: 0;
}

.video-player__source-btns {
	display: flex;
	gap: 4px;
	flex-wrap: wrap;
}

.video-player__source-btn {
	padding: 4px 12px;
	background: transparent;
	color: var(--color-surface-400);
	font-family: var(--font-sans);
	font-size: 0.8rem;
	font-weight: 500;
	letter-spacing: 0.02em;
	border: 1px solid var(--color-line);
	border-radius: 0;
	cursor: pointer;
	transition:
		color 500ms ease,
		border-color 500ms ease,
		background-color 500ms ease;
}

.video-player__source-btn:hover {
	color: var(--color-surface-50);
	border-color: var(--color-surface-400);
}

.video-player__source-btn--active {
	color: var(--color-brand-ink);
	background-color: var(--color-brand);
	border-color: var(--color-brand);
}

.video-player__source-btn--active:hover {
	background-color: var(--color-brand-hover);
	border-color: var(--color-brand-hover);
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
	transition: background-color 500ms ease;
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
	padding: 24px;
	text-align: center;
}
</style>
