// ics.ts: builds an iCalendar (.ics) file of all-day anniversary events, in the browser.
// No dependencies. RFC 5545: CRLF line endings, 75-octet line folding, escaped TEXT values.
//
// DATE CONVENTION: a calendar date (no time, no timezone) is a Date at 00:00 UTC.
// `parseIsoDate('2027-03-14')` gives exactly that, and `toIsoDate()` reads it back with UTC
// getters, so the day never shifts with the user's timezone. Never pass a local-time Date
// (e.g. `new Date()`) as an event date; use `todayUtc()` for "today".

export type ReminderMode = 'none' | 'same-day' | 'day-before';

export interface CalendarEvent {
	/** Stable across downloads so re-importing updates events instead of duplicating them. */
	uid: string;
	/** All-day date: a Date at 00:00 UTC (see DATE CONVENTION above). */
	date: Date;
	title: string;
	description?: string;
	/** Link back to the results page. */
	url?: string;
}

export interface IcsOptions {
	calendarName?: string;
	prodId?: string;
	reminder?: ReminderMode;
	/** Local hour (0-23) at which the reminder should fire. Default 9. */
	reminderHour?: number;
	/** Drop events before this date (a 00:00 UTC Date), e.g. todayUtc(). */
	fromDate?: Date;
	/** Injectable for tests. */
	now?: Date;
}

const CRLF = '\r\n';
const DAY_MS = 86_400_000;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const encoder = new TextEncoder();

// ---------- calendar-date helpers ----------

/** 'YYYY-MM-DD' -> Date at 00:00 UTC. Throws on malformed or impossible dates (e.g. 2027-02-30). */
export function parseIsoDate(iso: string): Date {
	if (!ISO_DATE_RE.test(iso)) throw new Error(`Invalid date "${iso}", expected YYYY-MM-DD`);
	const date = new Date(`${iso}T00:00:00Z`);
	if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) {
		throw new Error(`Invalid calendar date "${iso}"`);
	}
	return date;
}

/** Date at 00:00 UTC -> 'YYYY-MM-DD'. Throws if the Date is invalid or carries a time of day. */
export function toIsoDate(date: Date): string {
	assertCalendarDate(date);
	return date.toISOString().slice(0, 10);
}

/** Local calendar day of any Date (time of day dropped), as a Date at 00:00 UTC. */
export function fromLocalDate(date: Date): Date {
	return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

/** The user's local calendar day, as a Date at 00:00 UTC. */
export function todayUtc(now: Date = new Date()): Date {
	return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function addDays(date: Date, days: number): Date {
	return new Date(date.getTime() + days * DAY_MS);
}

function assertCalendarDate(date: Date): void {
	const t = date.getTime();
	if (Number.isNaN(t)) throw new Error('Invalid Date');
	if (t % DAY_MS !== 0) {
		throw new Error(
			`Expected a calendar date at 00:00 UTC, got ${date.toISOString()}. Use parseIsoDate() or todayUtc().`
		);
	}
}

function compact(date: Date): string {
	return toIsoDate(date).replaceAll('-', '');
}

/** Stable UID: same claimed date + same (count, unit) always gives the same UID. */
export function eventUid(claimedDate: Date, count: number, unit: string): string {
	return `${toIsoDate(claimedDate)}-${count}-${unit.toLowerCase()}@funniversaries.com`;
}

// ---------- ICS text helpers ----------

function escapeText(s: string): string {
	return s
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/\r?\n/g, '\\n');
}

/** Fold at 75 octets without splitting a multi-byte character. */
function foldLine(line: string): string {
	if (encoder.encode(line).length <= 75) return line;
	const parts: string[] = [];
	let current = '';
	let bytes = 0;
	let limit = 75;
	for (const ch of line) {
		const size = encoder.encode(ch).length;
		if (bytes + size > limit) {
			parts.push(current);
			current = '';
			bytes = 0;
			limit = 74; // continuation lines start with a space
		}
		current += ch;
		bytes += size;
	}
	parts.push(current);
	return parts.join(CRLF + ' ');
}

function stamp(now: Date): string {
	return now
		.toISOString()
		.replace(/[-:]/g, '')
		.replace(/\.\d{3}/, '');
}

function alarmLines(mode: ReminderMode, hour: number, title: string): string[] {
	if (mode === 'none') return [];
	const h = Math.min(23, Math.max(0, Math.trunc(hour)));
	// All-day events start at 00:00 local, so offsets are relative to midnight.
	// Same day at 09:00 -> PT9H. Day before at 09:00 -> -PT15H.
	const trigger = mode === 'same-day' ? `PT${h}H` : `-PT${24 - h}H`;
	return [
		'BEGIN:VALARM',
		'ACTION:DISPLAY',
		`DESCRIPTION:${escapeText(title)}`,
		`TRIGGER:${trigger}`,
		'END:VALARM'
	];
}

// ---------- public API ----------

export function buildIcs(events: CalendarEvent[], options: IcsOptions = {}): string {
	const {
		calendarName = 'Funniversaries',
		prodId = '-//Funniversaries//Anniversaries//EN',
		reminder = 'none',
		reminderHour = 9,
		fromDate,
		now = new Date()
	} = options;

	const seen = new Set<string>();
	const selected = events
		.filter((e) => {
			assertCalendarDate(e.date);
			if (fromDate && e.date.getTime() < fromDate.getTime()) return false;
			if (seen.has(e.uid)) return false;
			seen.add(e.uid);
			return true;
		})
		.sort((a, b) => a.date.getTime() - b.date.getTime());

	const lines: string[] = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		`PRODID:${prodId}`,
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		`X-WR-CALNAME:${escapeText(calendarName)}`
	];

	const dtstamp = stamp(now);
	for (const e of selected) {
		lines.push(
			'BEGIN:VEVENT',
			`UID:${e.uid}`,
			`DTSTAMP:${dtstamp}`,
			`DTSTART;VALUE=DATE:${compact(e.date)}`,
			`DTEND;VALUE=DATE:${compact(addDays(e.date, 1))}`, // DTEND is exclusive for all-day events
			`SUMMARY:${escapeText(e.title)}`
		);
		if (e.description) lines.push(`DESCRIPTION:${escapeText(e.description)}`);
		if (e.url) lines.push(`URL:${e.url}`);
		lines.push('TRANSP:TRANSPARENT'); // don't mark the day as "busy"
		lines.push(...alarmLines(reminder, reminderHour, e.title));
		lines.push('END:VEVENT');
	}

	lines.push('END:VCALENDAR');
	return lines.map(foldLine).join(CRLF) + CRLF;
}

/** Triggers a browser download. Call from a user gesture (click handler). */
export function downloadIcs(filename: string, content: string): void {
	const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.append(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** One-click "add this single event" link for Google Calendar (no reminder support). */
export function googleCalendarUrl(e: CalendarEvent): string {
	const params = new URLSearchParams({
		action: 'TEMPLATE',
		text: e.title,
		dates: `${compact(e.date)}/${compact(addDays(e.date, 1))}`
	});
	const details = [e.description, e.url].filter(Boolean).join('\n');
	if (details) params.set('details', details);
	return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
