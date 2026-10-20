<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const route = useRoute();
const router = useRouter();
const { count: whitelistCount } = useWhitelist();

const isScrolled = ref(false);
const isMenuOpen = ref(false);

const primaryLinks = computed(() => [
	{ to: '/', label: 'Home' },
	{ to: '/movies', label: 'Movies' },
	{ to: '/tv', label: 'TV Shows' },
]);

function onScroll() {
	isScrolled.value = window.scrollY > 12;
}

function openSearch() {
	if (route.path !== '/search') {
		router.push('/search');
	} else {
		const input = document.querySelector('[data-search-input]');
		if (input) input.focus();
	}
}

onMounted(() => {
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
	if (typeof window !== 'undefined') window.removeEventListener('scroll', onScroll);
});
</script>

<template>
	<header class="app-header" :class="{ 'is-scrolled': isScrolled }">
		<div class="app-header__inner">
			<NuxtLink to="/" class="app-header__brand" aria-label="ViewVerse home">
				<svg viewBox="0 0 32 22" aria-hidden="true" class="app-header__mark">
					<rect x="0" y="0" width="32" height="22" fill="none" stroke="currentColor" stroke-width="1" />
					<rect x="3" y="3" width="2" height="2" fill="currentColor" />
					<rect x="3" y="17" width="2" height="2" fill="currentColor" />
					<rect x="27" y="3" width="2" height="2" fill="currentColor" />
					<rect x="27" y="17" width="2" height="2" fill="currentColor" />
					<line x1="9" y1="22" x2="14" y2="0" stroke="currentColor" stroke-width="1.25" />
					<line x1="18" y1="22" x2="23" y2="0" stroke="currentColor" stroke-width="1.25" />
				</svg>
				<span class="app-header__brand-text">ViewVerse</span>
			</NuxtLink>

			<nav class="app-header__nav" aria-label="Primary">
				<NuxtLink v-for="link in primaryLinks" :key="link.to" :to="link.to" class="app-header__link" :active-class="'is-active'">
					<span class="app-header__link-text">{{ link.label }}</span>
					<span class="app-header__link-rule" aria-hidden="true" />
				</NuxtLink>
			</nav>

			<div class="app-header__actions">
				<button type="button" class="app-header__icon-btn" aria-label="Search" @click="openSearch">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path fill="none" stroke="currentColor" stroke-width="1.25" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.49-1.49zM9.5 14a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9" />
					</svg>
				</button>

				<NuxtLink to="/whitelist" class="app-header__icon-btn" aria-label="My List">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path fill="none" stroke="currentColor" stroke-width="1.25" d="M5 4h14v16l-7-3.5L5 20z" />
					</svg>
					<span v-if="whitelistCount > 0" class="app-header__badge" aria-hidden="true">
						{{ whitelistCount }}
					</span>
				</NuxtLink>

				<button type="button" class="app-header__icon-btn app-header__icon-btn--menu" aria-label="Open menu" @click="isMenuOpen = !isMenuOpen">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path v-if="!isMenuOpen" fill="none" stroke="currentColor" stroke-width="1.25" d="M3 6h18M3 12h18M3 18h18" />
						<path v-else fill="none" stroke="currentColor" stroke-width="1.25" d="M5 5l14 14M19 5L5 19" />
					</svg>
				</button>
			</div>
		</div>

		<nav v-if="isMenuOpen" class="app-header__mobile" aria-label="Mobile">
			<NuxtLink v-for="link in primaryLinks" :key="link.to" :to="link.to" class="app-header__mobile-link" :active-class="'is-active'" @click="isMenuOpen = false">
				{{ link.label }}
			</NuxtLink>
		</nav>
	</header>
</template>

<style scoped>
.app-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 50;
	background-color: var(--color-bg);
	border-bottom: 1px solid var(--color-line);
	transition:
		background-color 500ms ease,
		border-color 500ms ease;
}

.app-header.is-scrolled {
	background-color: rgba(7, 7, 10, 0.96);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
}

.app-header__inner {
	position: relative;
	display: flex;
	align-items: center;
	gap: 16px;
	max-width: var(--layout-max);
	margin-inline: auto;
	padding: 0 4vw;
	min-height: 56px;
}

.app-header__brand {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	color: var(--color-surface-50);
	text-decoration: none;
}

.app-header__mark {
	width: 30px;
	height: 22px;
	color: var(--color-brand);
}

.app-header__brand-text {
	font-family: var(--font-display);
	font-weight: 500;
	font-size: 1.15rem;
	letter-spacing: 0.01em;
	color: var(--color-surface-50);
}

.app-header__nav {
	display: none;
	gap: 26px;
}

@media (min-width: 768px) {
	.app-header__inner {
		justify-content: space-between;
	}

	.app-header__nav {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
	}
}

.app-header__link {
	position: relative;
	display: inline-block;
	padding: 4px 0;
	color: var(--color-surface-400);
	font-size: 0.78rem;
	font-weight: 500;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	text-decoration: none;
	transition: color 500ms ease;
}

.app-header__link:hover {
	color: var(--color-surface-50);
}

.app-header__link.is-active {
	color: var(--color-surface-50);
}

.app-header__link.is-active .app-header__link-rule {
	transform: scaleX(1);
}

.app-header__link-rule {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 1px;
	background-color: var(--color-brand);
	transform: scaleX(0);
	transform-origin: left center;
	transition: transform 500ms ease;
}

.app-header__actions {
	margin-left: auto;
	display: flex;
	align-items: center;
	gap: 4px;
}

.app-header__icon-btn {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	color: var(--color-surface-200);
	background: transparent;
	border: 0;
	border-radius: 0;
	text-decoration: none;
	cursor: pointer;
	transition:
		color 500ms ease,
		background-color 500ms ease;
}

.app-header__icon-btn:hover {
	color: var(--color-brand);
	background-color: rgba(240, 180, 41, 0.06);
}

.app-header__icon-btn svg {
	width: 20px;
	height: 20px;
}

.app-header__icon-btn--menu {
	display: inline-flex;
}

@media (min-width: 768px) {
	.app-header__icon-btn--menu {
		display: none;
	}
}

.app-header__badge {
	position: absolute;
	top: 6px;
	right: 6px;
	min-width: 16px;
	height: 16px;
	padding: 0 4px;
	background-color: var(--color-brand);
	color: var(--color-brand-ink);
	font-size: 0.65rem;
	font-weight: 700;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.app-header__mobile {
	display: flex;
	flex-direction: column;
	padding: 8px 4vw 16px;
	background-color: var(--color-bg);
	border-top: 1px solid var(--color-line);
	border-bottom: 1px solid var(--color-line);
}

@media (min-width: 768px) {
	.app-header__mobile {
		display: none;
	}
}

.app-header__mobile-link {
	padding: 14px 0;
	color: var(--color-surface-200);
	font-family: var(--font-display);
	font-size: 1.1rem;
	font-weight: 500;
	text-decoration: none;
	border-bottom: 1px solid var(--color-line);
}

.app-header__mobile-link:last-of-type {
	border-bottom: 0;
}

.app-header__mobile-link.is-active {
	color: var(--color-brand);
}
</style>
