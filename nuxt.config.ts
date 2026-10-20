import tailwindcss from '@tailwindcss/vite';

const PRERENDER_ROUTES = ['/', '/movies', '/movies/top-rated', '/movies/upcoming', '/movies/now-playing', '/tv', '/tv/top-rated', '/tv/on-the-air', '/tv/airing-today', '/search', '/whitelist'];

export default defineNuxtConfig({
	ssr: true,
	devtools: { enabled: false },
	routeRules: {
		'/movie/**': { ssr: false, prerender: false },
		'/tv/**': { ssr: false, prerender: false },
		'/person/**': { ssr: false, prerender: false },
		'/watch/movie/**': { ssr: false, prerender: false },
		'/watch/tv/**': { ssr: false, prerender: false },
	},

	app: {
		head: {
			title: 'ViewVerse',
			htmlAttrs: { lang: 'en' },
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'theme-color', content: '#0b0b0f' },
				{
					name: 'description',
					content: 'A performance-focused, Netflix-inspired movie and TV streaming experience.',
				},
				{ property: 'og:site_name', content: 'ViewVerse' },
				{ name: 'twitter:card', content: 'summary_large_image' },
			],
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		},
	},

	css: ['~/assets/css/main.css'],
	components: [{ path: '~/components', pathPrefix: false }],

	runtimeConfig: {
		public: {
			siteUrl: '',
			tmdbImageBase: 'https://image.tmdb.org/t/p',
			tmdbApiBase: 'https://api.themoviedb.org/3',
			tmdbToken: '',
		},
	},

	features: {
		inlineStyles: true,
	},

	experimental: {
		payloadExtraction: true,
	},

	compatibilityDate: '2025-07-15',

	nitro: {
		preset: 'static',
		compressPublicAssets: false,
		prerender: {
			crawlLinks: true,
			failOnError: false,
			routes: PRERENDER_ROUTES,
			hooks: {
				compiled: async (nitro) => {
					const tmdbToken = process.env.NUXT_PUBLIC_TMDB_TOKEN || '';
					if (!tmdbToken) {
						console.warn('[prerender] NUXT_PUBLIC_TMDB_TOKEN is empty — skipping genre expansion.');
						return;
					}
					try {
						const headers = {
							Authorization: `Bearer ${tmdbToken}`,
							Accept: 'application/json',
						};
						const [movies, tv] = await Promise.all([fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', { headers }).then((r) => r.json()), fetch('https://api.themoviedb.org/3/genre/tv/list?language=en', { headers }).then((r) => r.json())]);
						const ids = new Set<string>();
						for (const list of [movies, tv]) {
							for (const g of list?.genres || []) {
								if (Number.isFinite(g?.id)) ids.add(String(g.id));
							}
						}
						const dynamic = Array.from(ids).map((id) => `/genre/${id}`);
						(nitro.options.prerender.routes as string[]).push(...dynamic);
						console.log(`[prerender] added ${dynamic.length} /genre routes`);
					} catch (err) {
						console.warn('[prerender] failed to expand genre routes:', err);
					}
				},
			},
		},
	},

	vite: {
		plugins: [tailwindcss()],
		server: {
			allowedHosts: [''],
			host: true,
			cors: { origin: true },
		},
	},

	compatibility: {
		strict: false,
	},
});
