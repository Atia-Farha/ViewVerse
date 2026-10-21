import { truncate } from '~/utils/format.js';

let cachedSiteUrl = null;

function readConfiguredSiteUrl() {
	if (cachedSiteUrl !== null) return cachedSiteUrl;

	const fromEnv = import.meta.env?.NUXT_PUBLIC_SITE_URL;
	if (fromEnv) {
		cachedSiteUrl = String(fromEnv).replace(/\/+$/, '');
		return cachedSiteUrl;
	}

	try {
		const nuxtApp = useNuxtApp();
		if (nuxtApp?.$config?.public?.siteUrl) {
			cachedSiteUrl = String(nuxtApp.$config.public.siteUrl).replace(/\/+$/, '');
			return cachedSiteUrl;
		}
	} catch {}

	try {
		const configured = useRuntimeConfig().public?.siteUrl;
		if (configured) {
			cachedSiteUrl = String(configured).replace(/\/+$/, '');
			return cachedSiteUrl;
		}
	} catch {}

	return '';
}

export function siteOrigin() {
	const configured = readConfiguredSiteUrl();
	if (configured) return configured;

	if (import.meta.server) {
		try {
			const host = useRequestURL().host;
			return host ? `https://${host}` : '';
		} catch {
			return '';
		}
	}

	return typeof window !== 'undefined' ? window.location.origin : '';
}

export function absoluteUrl(path) {
	if (!path) return '';
	const origin = siteOrigin();
	const normalised = path.startsWith('/') ? path : `/${path}`;
	return origin ? `${origin}${normalised}` : normalised;
}

export function shareHeadMeta({ title, description, path, image, type = 'website' }) {
	const meta = [];
	const desc = description ? truncate(description, 155) : '';

	if (desc) meta.push({ name: 'description', content: desc });

	meta.push({ property: 'og:type', content: type });
	meta.push({ property: 'og:title', content: title });
	if (desc) meta.push({ property: 'og:description', content: desc });
	if (path) meta.push({ property: 'og:url', content: absoluteUrl(path) });

	const isCustomImage = Boolean(image);
	const defaultImage = absoluteUrl('/og-image.png');
	const shareImage = isCustomImage ? (image.startsWith('http') ? image : absoluteUrl(image)) : defaultImage;

	if (shareImage) {
		meta.push({ property: 'og:image', content: shareImage });
		if (!isCustomImage) {
			meta.push({ property: 'og:image:width', content: '1200' });
			meta.push({ property: 'og:image:height', content: '630' });
			meta.push({ property: 'og:image:type', content: 'image/png' });
		}
		if (title) meta.push({ property: 'og:image:alt', content: title });

		meta.push({ name: 'twitter:image', content: shareImage });
		if (title) meta.push({ name: 'twitter:image:alt', content: title });
	}

	meta.push({ name: 'twitter:title', content: title });
	if (desc) meta.push({ name: 'twitter:description', content: desc });

	return meta;
}
