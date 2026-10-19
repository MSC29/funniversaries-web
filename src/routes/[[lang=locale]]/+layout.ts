// src/routes/[[lang=locale]]/+layout.ts
import { DEFAULT } from '$lib/i18n/config';

export const load = ({ params }) => {
	console.log('root lang!! ' + params);
	return {
		locale: params.lang ?? DEFAULT
	};
};
