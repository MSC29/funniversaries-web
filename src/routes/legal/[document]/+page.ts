// src/routes/[lang]/legal/[document]/+page.server.ts
import { error } from '@sveltejs/kit';
import { getLocale } from '$lib/paraglide/runtime.js';
import { translatorService } from '$lib/services/translator.service.js';

export const prerender = true;

const documents = import.meta.glob('/src/content/legal/**/*.html', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const allowedDocuments = new Set(['privacy', 'terms', 'sales']);

export function load({ params }) {
	if (!allowedDocuments.has(params.document)) {
		error(404, 'Document not found');
	}

	const path = `/src/content/legal/${getLocale()}/${params.document}.html`;
	console.log('path legal ' + path);
	console.log('Available files:', Object.keys(documents));
	const loadDocument = documents[path];

	if (!loadDocument) {
		error(404, 'Document not available in this language');
	}

	const legalEntires = translatorService.getLegalMeta(params.document);
	console.log(legalEntires);

	return { documentType: params.document, loadDocument, ...legalEntires };
}
