import type { AnniversaryEntity } from '#lib/entities/anniversary.entity.ts';
import { m } from '#lib/paraglide/messages.js';

// "MemeNumber" or "meme_number" -> "meme_number"
export const snake = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

/** How much of a crowd-pleaser each kind is. Drives the "Headliner" of a bucket. */
const KIND_SCORE: Record<string, number> = {
	meme_number: 6,
	sequential: 5,
	repdigit: 4,
	palindrome: 3,
	power_of_two: 3,
	repeated_pair: 2,
	round_number: 1
};

export const kindScore = (kind: string) => KIND_SCORE[snake(kind)] ?? 0;

/** Best milestone of a bucket: highest kind score, then the soonest. */
export function pickHeadliner(list: AnniversaryEntity[]): AnniversaryEntity | undefined {
	return list.reduce<AnniversaryEntity | undefined>((best, a) => {
		if (!best) return a;
		const d = kindScore(a.funNumber.kind) - kindScore(best.funNumber.kind);
		return d > 0 || (d === 0 && a.date < best.date) ? a : best;
	}, undefined);
}

/** Anchor id for a bucket horizon: "Next 30 days" / "nextMonth" -> "next-30-days" / "next-month". */
export const horizonId = (horizon: string) =>
	'b-' +
	snake(horizon)
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

const messages = m as unknown as Record<
	string,
	((p?: Record<string, string>) => string) | undefined
>;

/** Display name of a horizon: bucket_<key> when it exists, else the API value as-is. */
export const horizonLabel = (horizon: string) =>
	messages[`bucket_${snake(horizon)}`]?.() ?? horizon;

/**
 * The fun line for a milestone. Looks for a hand-written punchline first, by number
 * ("fun_404_punch") then by description key ("fun_desc_round_punch"), both taking {who};
 * falls back to the factual description the API sends.
 */
export function punchline(a: AnniversaryEntity, who: string, translate: (k: string) => string) {
	const byCount = messages[`fun_${a.funNumber.count}_punch`];
	if (byCount) return byCount({ who });
	const byDesc = messages[`${a.funNumber.description}_punch`];
	if (byDesc) return byDesc({ who });
	return translate(a.funNumber.description);
}
