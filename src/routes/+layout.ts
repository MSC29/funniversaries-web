// src/routes/+layout.ts
import { PUBLIC_READY } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const ssr: boolean = false;
export const prerender = true;

export const load = ({ url }) => {
	if (PUBLIC_READY !== 'true' && url.pathname !== '/coming-soon') {
		redirect(307, '/coming-soon');
	}
};
