// src/routes/sitemap.xml/+server.ts
import type { RequestHandler } from './$types';
import { dateTypes } from '$lib/content/dateTypes';
import { LOCALES, DEFAULT_LOCALE, INDEXABLE_PATHS, urlFor } from '$lib/seo/pages';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const paths = [...dateTypes.filter((d) => d.slug != 'default').map((d) => `${d.slug}`)];

	const seoUrls = [...INDEXABLE_PATHS, ...paths].flatMap((path) =>
		LOCALES.map((locale) => {
			const alternates = [
				...LOCALES.map(
					(l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l, path)}"/>`
				),
				`<xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(DEFAULT_LOCALE, path)}"/>`
			].join('');
			return `<url><loc>${urlFor(locale, path)}</loc>${alternates}</url>`;
		})
	);

	const body = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${seoUrls.join('\n')}
        </urlset>`;

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
