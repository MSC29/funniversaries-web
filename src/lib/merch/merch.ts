import { PUBLIC_MERCH_ENABLED } from '$app/env/public';
import type { AnniversaryEntity } from '#lib/entities/anniversary.entity.ts';

export type MerchProduct = 'mug' | 'tee' | 'cap' | 'poster';

/**
 * One print / affiliate partner. Filled in when the partnership is signed;
 * nothing else in the app needs to change.
 */
export interface MerchProvider {
	id: string;
	products: MerchProduct[];
	/** ISO country codes it ships to; empty = everywhere */
	regions: string[];
	/** production + shipping, worst case */
	leadTimeDays: number;
	/**
	 * Partner URL for a product. Only anonymous data goes in: the milestone kind and
	 * product as sub-ID for commission tracking. Never names: if the partner later
	 * prints the card, that upload happens on their side, after the person orders.
	 */
	buildUrl(p: { product: MerchProduct; count: number; unit: string; kind: string }): string;
}

export const providers: MerchProvider[] = [
	// {
	// 	id: 'partner-name',
	// 	products: ['mug', 'tee', 'cap', 'poster'],
	// 	regions: [],
	// 	leadTimeDays: 10,
	// 	buildUrl: ({ product, count, unit, kind }) =>
	// 		`https://partner.example/ref/XXXX?product=${product}&sub=${kind}-${count}-${unit}`
	// }
];

export const merchEnabled = () => PUBLIC_MERCH_ENABLED === 'true' && providers.length > 0;

export type MerchTiming =
	{ state: 'in-time' } | { state: 'last-call'; orderBy: Date } | { state: 'too-late' };

const DAY = 86_400_000;
/** extra margin before we stop saying "arrives in time" */
const LAST_CALL_DAYS = 7;

/** Lead time decides what we show: nobody wants the mug after the party. */
export function merchTiming(a: AnniversaryEntity, p: MerchProvider, now = Date.now()): MerchTiming {
	const daysLeft = (a.date.getTime() - now) / DAY;
	if (daysLeft < p.leadTimeDays) return { state: 'too-late' };
	if (daysLeft < p.leadTimeDays + LAST_CALL_DAYS)
		return { state: 'last-call', orderBy: new Date(a.date.getTime() - p.leadTimeDays * DAY) };
	return { state: 'in-time' };
}
