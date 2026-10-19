import type { Locale } from './i18n/config';

// src/lib/seo.ts
export const ORIGIN = 'https://funniversaries.com';
export const pathFor = (l: Locale, slug?: string) => `/${l}/${slug ? slug + '/' : ''}`;
export const urlFor = (l: Locale, slug?: string) => ORIGIN + pathFor(l, slug);
