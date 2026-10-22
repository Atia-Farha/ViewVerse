<script setup>
const year = new Date().getFullYear();
</script>

<template>
	<footer class="app-footer" aria-labelledby="app-footer-heading">
		<h2 id="app-footer-heading" class="visually-hidden">Site footer</h2>

		<div class="app-footer__inner">
			<div class="app-footer__top">
				<section class="app-footer__brand-block" aria-label="About ViewVerse">
					<div class="app-footer__brand-row">
						<svg viewBox="0 0 32 22" aria-hidden="true" class="app-footer__mark">
							<rect x="0" y="0" width="32" height="22" fill="none" stroke="currentColor" stroke-width="1" />
							<rect x="3" y="3" width="2" height="2" fill="currentColor" />
							<rect x="3" y="17" width="2" height="2" fill="currentColor" />
							<rect x="27" y="3" width="2" height="2" fill="currentColor" />
							<rect x="27" y="17" width="2" height="2" fill="currentColor" />
							<line x1="9" y1="22" x2="14" y2="0" stroke="currentColor" stroke-width="1.25" />
							<line x1="18" y1="22" x2="23" y2="0" stroke="currentColor" stroke-width="1.25" />
						</svg>
						<span class="app-footer__brand-name">ViewVerse</span>
					</div>
					<p class="app-footer__brand-tagline">A platform for browsing and watching movies and TV shows.</p>
				</section>

				<nav class="app-footer__columns" aria-label="Footer">
					<section class="app-footer__column" aria-labelledby="footer-col-browse">
						<h3 id="footer-col-browse" class="app-footer__column-heading">Browse</h3>
						<ul class="app-footer__column-list">
							<li><NuxtLink to="/movies">Movies</NuxtLink></li>
							<li><NuxtLink to="/movies/now-playing">Now Playing</NuxtLink></li>
							<li><NuxtLink to="/movies/top-rated">Top Rated</NuxtLink></li>
							<li><NuxtLink to="/movies/upcoming">Upcoming</NuxtLink></li>
							<li><NuxtLink to="/tv">TV Shows</NuxtLink></li>
							<li><NuxtLink to="/tv/airing-today">Air &amp; On The Air</NuxtLink></li>
						</ul>
					</section>

					<section class="app-footer__column" aria-labelledby="footer-col-watch">
						<h3 id="footer-col-watch" class="app-footer__column-heading">Watch</h3>
						<ul class="app-footer__column-list">
							<li><NuxtLink to="/whitelist">My List</NuxtLink></li>
							<li><NuxtLink to="/search">Search</NuxtLink></li>
						</ul>
					</section>

					<section class="app-footer__column" aria-labelledby="footer-col-info">
						<h3 id="footer-col-info" class="app-footer__column-heading">Data &amp; Credits</h3>
						<ul class="app-footer__column-list app-footer__column-list--meta">
							<li>
								<span class="app-footer__term">Catalog</span>
								<a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a>
							</li>
							<li>
								<span class="app-footer__term">Streaming</span>
								<div class="app-footer__sources">
									<a href="https://cinesrc.st/" target="_blank" rel="noopener noreferrer">CineSrc</a>
									<a href="https://vidfast.pro/" target="_blank" rel="noopener noreferrer">VidFast</a>
									<a href="https://nxsha.screenscape.me/" target="_blank" rel="noopener noreferrer">ScreenScape</a>
								</div>
							</li>
						</ul>
						<p class="app-footer__disclaimer">ViewVerse is an independent project created for learning purposes. Not affiliated with TMDB, CineSrc, VidFast, or ScreenScape.</p>
					</section>
				</nav>
			</div>

			<hr class="app-footer__rule" aria-hidden="true" />

			<div class="app-footer__bottom">
				<p class="app-footer__copyright">© {{ year }} ViewVerse. All rights reserved.</p>
				<p class="app-footer__dedication">A little creation by Cinnamoroll, dedicated to Pompompurin <span class="app-footer__heart">♡</span></p>
			</div>
		</div>
	</footer>
</template>

<style scoped>
.app-footer {
	border-top: 1px solid var(--color-line);
	background-color: var(--color-bg);
	color: var(--color-surface-400);
	font-family: var(--font-sans);
}

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.app-footer__inner {
	padding: 56px 4vw 32px;
}

@media (min-width: 1024px) {
	.app-footer__inner {
		max-width: var(--layout-max);
		margin: 0 auto;
	}
}

.app-footer__top {
	display: grid;
	grid-template-columns: 1fr;
	gap: 40px;
}

@media (min-width: 1024px) {
	.app-footer__top {
		grid-template-columns: 1.1fr 2fr;
		gap: 56px;
	}
}

@media (min-width: 1024px) {
	.app-footer__top {
		grid-template-columns: 1.1fr 2.4fr;
		gap: 80px;
	}
}

.app-footer__brand-block {
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-width: 32ch;
}

.app-footer__brand-row {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}

.app-footer__mark {
	width: 30px;
	height: 22px;
	color: var(--color-brand);
}

.app-footer__brand-name {
	font-family: var(--font-display);
	font-weight: 500;
	font-size: 1.2rem;
	letter-spacing: 0.01em;
	color: var(--color-surface-50);
}

.app-footer__brand-tagline {
	margin: 0;
	font-size: 0.92rem;
	line-height: 1.55;
	color: var(--color-surface-400);
}

.app-footer__columns {
	display: grid;
	grid-template-columns: 1fr;
	gap: 32px;
}

@media (min-width: 1024px) {
	.app-footer__columns {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 40px 24px;
	}
}

.app-footer__column {
	min-width: 0;
}

.app-footer__column-heading {
	margin: 0 0 16px;
	font-family: var(--font-sans);
	font-size: 0.7rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.18em;
	color: var(--color-surface-50);
}

.app-footer__column-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.app-footer__column-list a {
	display: inline-block;
	color: var(--color-surface-400);
	font-size: 0.88rem;
	line-height: 1.4;
	text-decoration: none;
	transition: color 500ms ease;
}

.app-footer__column-list a:hover,
.app-footer__column-list a:focus-visible {
	color: var(--color-brand);
}

.app-footer__column-list--meta {
	gap: 14px;
}

.app-footer__column-list--meta li {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
	padding-bottom: 12px;
	border-bottom: 1px solid var(--color-line);
}

.app-footer__column-list--meta li:last-child {
	border-bottom: 0;
	padding-bottom: 0;
}

.app-footer__term {
	font-family: var(--font-mono);
	font-size: 0.68rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--color-surface-500);
}

.app-footer__sources {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.app-footer__column-list--meta a {
	font-size: 0.88rem;
	color: var(--color-surface-300);
}

.app-footer__disclaimer {
	margin: 16px 0 0;
	font-size: 0.75rem;
	line-height: 1.5;
	color: var(--color-surface-500);
}

.app-footer__rule {
	height: 1px;
	background-color: var(--color-line);
	border: 0;
	margin: 48px 0 24px;
}

.app-footer__bottom {
	width: 100%;
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	justify-content: center;
	row-gap: 1.5em;
	text-align: center;
}

.app-footer__copyright {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.72rem;
	letter-spacing: 0.06em;
	color: var(--color-surface-500);
	text-align: center;
}

.app-footer__dedication {
	margin: 0;
	font-size: 0.76rem;
	letter-spacing: 0.02em;
	color: var(--color-surface-400);
	text-align: center;
	cursor: default;
}

@media (min-width: 850px) {
	.app-footer__bottom {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		column-gap: 2rem;
		text-align: left;
	}

	.app-footer__copyright {
		text-align: left;
	}

	.app-footer__dedication {
		text-align: right;
	}
}

.app-footer__heart {
	color: #f472b6;
	display: inline-block;
	transition: transform 500ms ease;
}

.app-footer__dedication:hover .app-footer__heart {
	transform: scale(1.2);
}
</style>
