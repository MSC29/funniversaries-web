// src/lib/i18n/format.ts
import { page } from '$app/state';
import { formatCalendarDate } from '$lib/dates';
import { prefs } from './prefs.svelte';
import { resolveTag } from './resolve';

export const tag = () =>
	resolveTag({ saved: prefs.saved, nav: prefs.nav, pageLang: page.data.locale });

export const date = (date: Date) => formatCalendarDate(date, tag());
// export const instant = (iso: string) => formatInstant(iso, tag());
