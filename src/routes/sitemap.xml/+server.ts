// src/routes/sitemap.xml/+server.ts
import type { RequestHandler } from './$types';
import { dateTypes } from '$lib/content/dateTypes';
// import { famousDates } from '$lib/content/famousDates';

export const prerender = true;

const site = 'https://funniversaries-web.pages.dev';

export const GET: RequestHandler = async () => {
	const paths = [
		'/',
		...dateTypes.map((d) => `/${d.slug}`)
		// ...famousDates.map((d) => `/${d.slug}`)
		// /d/[date] pages are deliberately excluded — noindex, see below
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${site}${p}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
