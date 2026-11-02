/**
 * Draws the 1080×1350 (Instagram 4:5) share card on a canvas.
 * One function for the live preview and the downloaded PNG, so they can't drift.
 * Runs in the browser only: names never leave the device.
 */
export const CARD_W = 1080;
export const CARD_H = 1350;

export interface CardTheme {
	id: string;
	bg: string;
	fg: string;
	pillBg: string;
	pillFg: string;
}

// Same values as the @theme tokens in app.css (canvas can't read CSS variables cheaply).
const INK = '#1b1530';
const CREAM = '#fff4e0';
export const THEMES: CardTheme[] = [
	{ id: 'coral', bg: '#ff5a36', fg: INK, pillBg: INK, pillFg: CREAM },
	{ id: 'sun', bg: '#ffc93c', fg: INK, pillBg: INK, pillFg: CREAM },
	{ id: 'night', bg: INK, fg: CREAM, pillBg: '#ff5a36', pillFg: INK }
];

export interface CardData {
	pill: string; // "LÉA & TOM · FRI DEC 11"
	number: string; // "404"
	unit: string; // "days together"
	caption: string; // "Relationship: found."
	credit: string | null; // "made with Funniversaries" (free cards) or null
	cta: string; // "Find yours →"
	theme: CardTheme;
}

const DISPLAY = '"Bricolage Grotesque", "DM Sans", sans-serif';
const SANS = '"DM Sans", system-ui, sans-serif';

function roundRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
) {
	ctx.beginPath();
	ctx.roundRect(x, y, w, h, r);
}

/** Shrinks the font until `text` fits in `maxW`. Returns the size used. */
function fit(
	ctx: CanvasRenderingContext2D,
	text: string,
	weight: number,
	family: string,
	start: number,
	maxW: number
) {
	let size = start;
	do {
		ctx.font = `${weight} ${size}px ${family}`;
		if (ctx.measureText(text).width <= maxW) break;
		size -= 4;
	} while (size > 24);
	return size;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
	const lines: string[] = [];
	let line = '';
	for (const word of text.split(/\s+/)) {
		const next = line ? `${line} ${word}` : word;
		if (ctx.measureText(next).width > maxW && line) {
			lines.push(line);
			line = word;
		} else line = next;
	}
	if (line) lines.push(line);
	return lines.slice(0, 3);
}

export async function drawShareCard(canvas: HTMLCanvasElement, d: CardData) {
	await document.fonts?.ready;
	canvas.width = CARD_W;
	canvas.height = CARD_H;
	const ctx = canvas.getContext('2d')!;
	const P = 88;
	const t = d.theme;

	ctx.fillStyle = t.bg;
	ctx.fillRect(0, 0, CARD_W, CARD_H);

	// confetti
	const dots: [number, number, number, string][] = [
		[110, 440, 16, '#ffc93c'],
		[960, 170, 12, CREAM],
		[930, 790, 20, '#ffc93c'],
		[430, 130, 10, t.fg]
	];
	for (const [x, y, r, c] of dots) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fillStyle = c;
		ctx.fill();
	}

	// pill
	ctx.font = `700 30px ${SANS}`;
	const pillW = Math.min(ctx.measureText(d.pill).width + 56, CARD_W - 2 * P);
	ctx.fillStyle = t.pillBg;
	roundRect(ctx, P, P, pillW, 64, 32);
	ctx.fill();
	ctx.fillStyle = t.pillFg;
	ctx.textBaseline = 'middle';
	ctx.fillText(d.pill, P + 28, P + 33, pillW - 56);

	// number + unit
	ctx.fillStyle = t.fg;
	ctx.textBaseline = 'alphabetic';
	const numSize = fit(ctx, d.number, 800, DISPLAY, 300, CARD_W - 2 * P);
	ctx.fillText(d.number, P - 6, 560);
	fit(ctx, d.unit, 800, DISPLAY, 104, CARD_W - 2 * P);
	ctx.fillText(d.unit, P, 560 + Math.max(110, numSize * 0.38));

	// caption sticker
	if (d.caption.trim()) {
		ctx.save();
		ctx.translate(P, 860);
		ctx.rotate((-2 * Math.PI) / 180);
		ctx.font = `700 44px ${SANS}`;
		const lines = wrap(ctx, d.caption, CARD_W - 2 * P - 80);
		const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 64;
		const h = lines.length * 54 + 44;
		ctx.fillStyle = INK; // hard shadow
		roundRect(ctx, 8, 8, w, h, 28);
		ctx.fill();
		ctx.fillStyle = CREAM;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 4;
		roundRect(ctx, 0, 0, w, h, 28);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = INK;
		lines.forEach((l, i) => ctx.fillText(l, 32, 22 + 44 + i * 54 - 8));
		ctx.restore();
	}

	// footer
	ctx.fillStyle = t.fg;
	ctx.font = `800 40px ${DISPLAY}`;
	ctx.textBaseline = 'middle';
	ctx.fillText(d.credit ?? 'Funniversaries', P, CARD_H - P - 20);
	ctx.font = `700 30px ${SANS}`;
	ctx.textAlign = 'right';
	ctx.fillText(d.cta, CARD_W - P, CARD_H - P - 20);
	ctx.textAlign = 'left';
}

export async function downloadCard(canvas: HTMLCanvasElement, filename: string) {
	const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
	if (!blob) return;
	const file = new File([blob], filename, { type: 'image/png' });
	// Phones: native share sheet with the picture. Desktop: plain download.
	if (navigator.canShare?.({ files: [file] })) {
		await navigator.share({ files: [file] }).catch(() => {});
		return;
	}
	const url = URL.createObjectURL(blob);
	const link = Object.assign(document.createElement('a'), { href: url, download: filename });
	link.click();
	URL.revokeObjectURL(url);
}
