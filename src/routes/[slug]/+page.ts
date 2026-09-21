// src/routes/[slug]/+page.ts
import { error } from '@sveltejs/kit';
import { dateTypes } from '$lib/content/dateTypes';
// import { famousDates } from '$lib/content/famousDates';
import type { PageLoad, EntryGenerator } from './$types';

export const prerender = true;

// Tells SvelteKit's prerenderer exactly which slugs exist, so it doesn't
// need to discover them by crawling links — this is the actual mechanism
// that turns catalog entries into real static HTML files at build time.
export const entries: EntryGenerator = () => [
	...dateTypes.map((d) => ({ slug: d.slug }))
	// ...famousDates.map((d) => ({ slug: d.slug }))
];

export const load: PageLoad = ({ params }) => {
	const dateType = dateTypes.find((d) => d.slug === params.slug);
	if (dateType) return { kind: 'date-type' as const, entry: dateType };

	// const famous = famousDates.find((d) => d.slug === params.slug);
	// if (famous) return { kind: 'famous-date' as const, entry: famous };

	error(404, 'Not found');
};
