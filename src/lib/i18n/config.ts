// src/lib/i18n/config.ts
export const LOCALES = ['en', 'fr'] as const; // add a line to add a language
export const DEFAULT = 'en';
export type Locale = (typeof LOCALES)[number];

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

// navigator.languages is ordered by preference: ["fr-CH", "fr", "en-US"]
export function pickLocale(candidates: readonly string[]): Locale {
	console.log('pick locale from ' + candidates.length);
	for (const tag of candidates) {
		const base = tag.toLowerCase().split('-')[0];
		console.log('base  ' + base);
		if (isLocale(base)) return base;
	}
	return DEFAULT;
}
