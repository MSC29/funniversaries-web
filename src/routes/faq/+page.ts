// src/routes/[lang]/legal/[document]/+page.server.ts
import { error } from '@sveltejs/kit';
import { getLocale } from '$lib/paraglide/runtime.js';

export const prerender = true;

const documents = import.meta.glob('$lib/content/faq/**/faq.html', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export function load() {
	const path = `/src/lib/content/faq/${getLocale()}/faq.html`;
	console.log('path legal ' + path);
	console.log('Available files:', Object.keys(documents));
	const loadDocument = documents[path];

	if (!loadDocument) {
		error(404, 'Document not available in this language');
	}

	return { loadDocument };
}
