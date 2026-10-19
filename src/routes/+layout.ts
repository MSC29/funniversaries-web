// src/routes/+layout.ts
import { PUBLIC_READY } from '$env/static/public';
import { isLocale, pickLocale } from '$lib/i18n/config';
import { redirect } from '@sveltejs/kit';

export const ssr: boolean = false;
export const prerender = true;
export const trailingSlash = 'always';

export const load = ({ url }) => {
	if (PUBLIC_READY !== 'true' && url.pathname !== '/coming-soon') {
		redirect(307, '/coming-soon');
	}

	console.log('root!! ' + url.pathname);
	let saved: string | null = null;
	try {
		saved = localStorage.getItem('locale');
	} catch {
		console.error('error?');
	}
	const locale = saved && isLocale(saved) ? saved : pickLocale(navigator.languages);
	console.log('locale: ' + locale);
};
