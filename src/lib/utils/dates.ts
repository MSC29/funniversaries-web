const S = 1000;
const DAY = 86400 * S;

import { getLocale } from '$lib/paraglide/runtime.js';

export function formatRelativeDays(ms: Date, now = Date.now()) {
	const locale = getLocale();
	const d = Math.max(0, Math.round((ms.getTime() - now) / DAY));
	// if (d === 0) return 'today';
	// if (d === 1) return 'tomorrow';
	return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(d, 'day');
}

const cache = new Map<string, Intl.DateTimeFormat>();

function fmt(locale: string, opts: Intl.DateTimeFormatOptions) {
	const key = locale + JSON.stringify(opts);
	if (!cache.has(key)) cache.set(key, new Intl.DateTimeFormat(locale, opts));
	return cache.get(key)!;
}

// "2020-03-14" -> "14 mars 2020" (fr) / "March 14, 2020" (en-US)
export function formatCalendarDate(ms: Date, locale: string) {
	return fmt(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(ms);
}

// "2020-03-14" -> "14 mars 2020" (fr) / "March 14, 2020" (en-US)
export function formatDate(date: Date) {
	const locale = getLocale();
	return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
