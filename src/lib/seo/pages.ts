export const LOCALES = ['en', 'fr', 'es'] as const; // add a line to add a language
export const DEFAULT_LOCALE = 'en';
export const INDEXABLE_PATHS = ['faq', 'pricing', 'recover'];
export type Locale = (typeof LOCALES)[number];
export const ORIGIN = 'https://funniversaries.com';
export const pathFor = (l: Locale, slug?: string) => `/${l}/${slug ? slug + '/' : ''}`;
export const urlFor = (l: Locale, slug?: string) => ORIGIN + pathFor(l, slug);
