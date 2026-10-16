const S = 1000;
const DAY = 86400 * S;

export function formatRelativeDays(ms: Date, now = Date.now()) {
	console.log('formatRelativeDays');
	console.log(ms.getTime());
	console.log(now);

	const d = Math.max(0, Math.round((ms.getTime() - now) / DAY));
	// if (d === 0) return 'today';
	// if (d === 1) return 'tomorrow';
	return new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }).format(d, 'day');
}

const cache = new Map<string, Intl.DateTimeFormat>();

function fmt(locale: string, opts: Intl.DateTimeFormatOptions) {
	const key = locale + JSON.stringify(opts);
	if (!cache.has(key)) cache.set(key, new Intl.DateTimeFormat(locale, opts));
	return cache.get(key)!;
}

// "2020-03-14" -> "14 mars 2020" (fr) / "March 14, 2020" (en-US)
export function formatCalendarDate(ms: Date) {
	return fmt('fr', { dateStyle: 'long', timeZone: 'UTC' }).format(ms);
}
