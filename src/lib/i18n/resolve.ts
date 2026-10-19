// src/lib/i18n/resolve.ts: pure, so it's easy to unit test
import { DEFAULT } from './config';

const valid = (t: string) => {
	try {
		return Intl.DateTimeFormat.supportedLocalesOf(t).length > 0;
	} catch {
		return false;
	}
};
const base = (t: string) => t.toLowerCase().split('-')[0];

export function resolveTag(o: {
	saved?: string | null;
	nav: readonly string[];
	pageLang?: string;
}) {
	if (o.saved && valid(o.saved)) return o.saved;
	const nav = o.nav.filter(valid);
	if (o.pageLang) return nav.find((t) => base(t) === o.pageLang) ?? o.pageLang;
	return nav[0] ?? DEFAULT;
}
