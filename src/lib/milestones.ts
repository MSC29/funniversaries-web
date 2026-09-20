const S = 1000;
const DAY = 86400 * S;

export const fmt = (n) => n.toLocaleString('en-US');

/**
 * All milestones for an origin date, chronologically.
 * Each: { ms, headline, category, blurb, score }
 * score = how interesting it is (10 = digit sequence, 3 = arbitrary day count).
 */
export function milestones(originMs) {
	const out = [];
	const add = (ms, headline, category, blurb, score = 3) =>
		out.push({ ms, headline, category, blurb, score });

	for (let n = 16; n <= 35; n++) {
		const v = Math.pow(2, n);
		add(
			originMs + v * S,
			fmt(v) + ' seconds',
			'Power of two',
			'2^' + n + ' seconds since the start.',
			8
		);
	}

	for (const m of [1, 2, 3, 5, 7]) {
		for (let k = 5; k <= 9; k++) {
			const v = m * Math.pow(10, k);
			add(
				originMs + v * S,
				fmt(v) + ' seconds',
				'Round number',
				'A clean, round milestone.',
				m === 1 ? 8 : 6
			);
		}
	}

	for (let d = 1; d <= 9; d++) {
		for (let len = 6; len <= 10; len++) {
			const v = Number(String(d).repeat(len));
			add(originMs + v * S, fmt(v) + ' seconds', 'Repdigit', 'Every digit is the same.', 9);
		}
	}

	add(originMs + 123456789 * S, '123,456,789 seconds', 'Sequence', 'Every digit in order.', 10);

	const special = {
		666: 'The spooky one.',
		777: 'Lucky sevens.',
		1234: 'One, two, three, four.',
		12345: 'Counting up.'
	};
	const dayList = [
		100, 365, 1000, 2500, 5000, 7500, 10000, 12500, 15000, 20000, 25000, 30000, 40000, 666, 777,
		1234, 12345
	];
	for (let d = 500; d <= 45000; d += 500) dayList.push(d);
	for (const d of Array.from(new Set(dayList)).sort((a, b) => a - b)) {
		add(
			originMs + d * DAY,
			fmt(d) + ' days',
			'Day count',
			special[d] || 'Roughly ' + (d / 365.25).toFixed(1) + ' years, to the day.',
			special[d] ? 8 : d % 1000 === 0 ? 6 : 3
		);
	}

	for (let w = 100; w <= 6500; w += 100) {
		add(
			originMs + w * 7 * DAY,
			fmt(w) + ' weeks',
			'Week count',
			fmt(w) + ' weeks, exactly.',
			w % 500 === 0 ? 7 : 4
		);
	}

	for (const mo of [
		100, 200, 250, 300, 333, 400, 500, 600, 666, 750, 800, 900, 1000, 1111, 1200, 1234, 1400
	]) {
		const d = new Date(originMs);
		d.setMonth(d.getMonth() + mo);
		add(
			d.getTime(),
			fmt(mo) + ' months',
			'Month count',
			fmt(mo) + ' months to the day.',
			mo % 100 === 0 ? 6 : 5
		);
	}

	for (const m of [1, 2, 3, 5]) {
		for (let k = 5; k <= 8; k++) {
			const v = m * Math.pow(10, k);
			add(
				originMs + v * 60 * S,
				fmt(v) + ' minutes',
				'Round number',
				'A round count of minutes.',
				5
			);
		}
	}

	for (const h of [
		1000, 5000, 10000, 25000, 50000, 100000, 111111, 200000, 250000, 500000, 750000, 1000000
	]) {
		add(
			originMs + h * 3600 * S,
			fmt(h) + ' hours',
			'Hour count',
			fmt(h) + ' hours on the clock.',
			h === 111111 ? 8 : 5
		);
	}

	return out.sort((a, b) => a.ms - b.ms);
}

export function upcoming(dateStr, now = Date.now()) {
	const originMs = new Date(dateStr + 'T00:00:00').getTime();
	if (Number.isNaN(originMs)) return [];
	return milestones(originMs).filter((m) => m.ms > now);
}

/** Chronological, but skips filler and won't repeat a category back to back. */
export function curate(list, n) {
	const out = [];
	const used = {};
	for (const m of list) {
		if (out.length >= n) break;
		if (m.score < 5) continue;
		const prev = out[out.length - 1];
		if (prev && prev.category === m.category && m.score < 8) continue;
		if ((used[m.category] || 0) >= 2 && m.score < 9) continue;
		out.push(m);
		used[m.category] = (used[m.category] || 0) + 1;
	}
	for (const m of list) {
		if (out.length >= n) break;
		if (!out.includes(m)) out.push(m);
	}
	return out.sort((a, b) => a.ms - b.ms);
}

/** Hero = most interesting milestone inside the next year; the rest follow it. */
export function select(list, n, now = Date.now()) {
	if (!list.length) return [];
	const year = 365 * DAY;
	let window = list.filter((m) => m.ms < now + year);
	if (!window.length) window = list.slice(0, 20);
	let hero = window[0];
	for (const m of window) if (m.score > hero.score) hero = m;
	return [
		hero,
		...curate(
			list.filter((m) => m.ms > hero.ms),
			n - 1
		)
	];
}

export function countdown(ms, now = Date.now()) {
	const d = Math.max(0, Math.round((ms - now) / DAY));
	if (d === 0) return 'today';
	if (d === 1) return 'tomorrow';
	return 'in ' + fmt(d) + ' days';
}

export const longDate = (ms) =>
	new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(ms));
export const midDate = (ms) =>
	new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(
		new Date(ms)
	);
export const shortDate = (ms) =>
	new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
		new Date(ms)
	);

export const splitHeadline = (headline) => {
	const parts = headline.split(' ');
	return { number: parts[0], unit: parts.slice(1).join(' ') };
};

export const DEFAULT_ORIGIN = '2024-02-29';
export const FREE_COUNT = 5;
