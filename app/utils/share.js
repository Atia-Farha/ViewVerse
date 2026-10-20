import { truncate } from '~/utils/format.js';

/**
 * Read the configured public site URL without requiring an active Nuxt
 * instance.
 *
 * `useRuntimeConfig()` throws (NUXT_E1001) when called outside a Nuxt context —
 * and unhead evaluates `useHead` getters lazily during prerender, *after* the
 * component setup scope has closed. Reading the compile-time inlined value
 * directly keeps `siteOrigin()` safe to call from anywhere: page setup, head
 * resolution, plain utils, or prerender internals.
 */
function readConfiguredSiteUrl() {
	// Nuxt inlines NUXT_PUBLIC_* into import.meta.env at build time, so this is
	// available on both server and client with no runtime context needed.
	const fromEnv = import.meta.env?.NUXT_PUBLIC_SITE_URL;
	if (fromEnv) return String(fromEnv).replace(/\/+$/, '');

	// Fall back to runtimeConfig only when we're safely inside a Nuxt context.
	try {
		const configured = useRuntimeConfig().public?.siteUrl;
		if (configured) return String(configured).replace(/\/+$/, '');
	} catch {
		/* no Nuxt context — fall through to the request/window fallbacks */
	}
	return '';
}

/**
 * Build the absolute origin used for og:url and share links.
 * Falls back to the current request origin on the server and
 * `window.location.origin` on the client when nothing is configured.
 */
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

/**
 * Absolute URL for a route path, used for `og:url`.
 * Returns the bare path when no origin is known so we never emit a broken link.
 */
export function absoluteUrl(path) {
	if (!path) return '';
	const origin = siteOrigin();
	const normalised = path.startsWith('/') ? path : `/${path}`;
	return origin ? `${origin}${normalised}` : normalised;
}

/**
 * Build the raw `head.meta` array entries for share-preview metadata.
 * Returns the object shape that spread-into `useHead({ meta: [...] })` expects,
 * because `useHead` does not translate camelCase shorthand the way `useSeoMeta` does.
 *
 * Set once in nuxt.config: `og:site_name`, `twitter:card=summary_large_image`.
 *
 * @param {object} input
 * @param {string} input.title       Page title (used for og:title and twitter:title).
 * @param {string} [input.description] Raw text; truncated to ~155 chars.
 * @param {string} [input.path]      Route path for og:url.
 * @param {string} [input.image]     Absolute share image URL (prefer a 16:9 backdrop).
 * @param {string} [input.type]      og:type. Defaults to 'website'.
 */
export function shareHeadMeta({ title, description, path, image, type = 'website' }) {
	const meta = [];

	if (description) meta.push({ name: 'description', content: truncate(description, 155) });

	meta.push({ property: 'og:type', content: type });
	meta.push({ property: 'og:title', content: title });
	if (description) meta.push({ property: 'og:description', content: truncate(description, 155) });
	if (path) meta.push({ property: 'og:url', content: absoluteUrl(path) });
	if (image) meta.push({ property: 'og:image', content: image });

	meta.push({ name: 'twitter:title', content: title });
	if (description) meta.push({ name: 'twitter:description', content: truncate(description, 155) });
	if (image) meta.push({ name: 'twitter:image', content: image });

	return meta;
}
