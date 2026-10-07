import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	ssr: true,
	devtools: { enabled: false },
	app: {
		head: {
			title: 'ViewVerse',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'theme-color', content: '#0b0b0f' },
				{
					name: 'description',
					content: 'A performance-focused, Netflix-inspired movie and TV streaming experience.',
				},
			],
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		},
	},
	css: ['~/assets/css/main.css'],
	components: [{ path: '~/components', pathPrefix: false }],
	runtimeConfig: {
		public: {
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
		compressPublicAssets: true,
	},
	vite: {
		plugins: [tailwindcss()],
	},
	compatibility: {
		strict: false,
	},
});
