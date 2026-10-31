import { m } from '$lib/paraglide/messages.js';
import { getLocale } from '$lib/paraglide/runtime.js';

const reasonMessage = {
	invalid_request: m.claim_reason_api_invalid_request(),
	service_unavailable: m.claim_reason_api_service_unavailable(),
	internal_error: m.claim_reason_api_internal_error()
} as const;

// The API returns message keys such as "fun_42_label". Looking them up on `m` avoids a hand-kept Map
// that would copy messages/en.json. A test (in the Rust file) catches a key without a message.
const messages = m as unknown as Record<string, (() => string) | undefined>;

// Units the browser already writes correctly in every language, plural forms included.
const INTL_UNIT: Record<string, string> = {
	milliseconds: 'millisecond',
	seconds: 'second',
	days: 'day',
	hours: 'hour',
	weeks: 'week',
	months: 'month',
	years: 'year'
};

const SUPERSCRIPT = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const superscript = (n: number) =>
	[...String(n)].map((digit) => SUPERSCRIPT[Number(digit)]).join('');

const LEGAL_PAGES = {
	privacy: { title: m.legal_privacy_title(), description: m.legal_privacy_description() },
	terms: { title: m.legal_terms_title(), description: m.legal_terms_description() },
	sales: { title: m.legal_sales_title(), description: m.legal_sales_description() }
};

export type LegalDocument = keyof typeof LEGAL_PAGES;

// "MercuryYears" or "mercury_years" -> "mercury_years"
const snake = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

/** unit_<id>_<CLDR plural category>, falling back to _other when a language has no such form. */
function unitKey(id: string, count: number): string {
	const category = new Intl.PluralRules(getLocale()).select(count); // one, other, many, ...
	const exact = `unit_${id}_${category}`;
	return messages[exact] ? exact : `unit_${id}_other`;
}

export class TranslatorService {
	getClaimReason = (reason: keyof typeof reasonMessage): string => {
		return reasonMessage[reason];
	};

	/** Any key from the API. A missing key returns the key itself, so a gap is visible, never blank. */
	translate = (key: string): string => messages[key]?.() ?? key;

	/** Unit name for a UnitId from the API; plural by default, which suits filter labels. */
	// getUnit = (unitId: string, count = 2): string => this.translate(unitKey(snake(unitId), count));

	// getTitle = (count: number): string =>
	// 	messages[`fun_${count}_title`]?.() ?? new Intl.NumberFormat(getLocale()).format(count);

	/**
	 * "1,000,000 seconds" / "1 000 000 de secondes". The language decides the plural form from the
	 * count (French writes "de" after millions), so the API never needs to know about plurals.
	 */
	formatQuantity = (count: number, unitId: string): string => {
		const locale = getLocale();
		const id = snake(unitId);
		const intlUnit = INTL_UNIT[id];

		if (intlUnit) {
			return new Intl.NumberFormat(locale, {
				style: 'unit',
				unit: intlUnit,
				unitDisplay: 'long'
			}).format(count);
		}
		// Fortnights, quarters, lunar months, Mercury years: our own words.
		return `${new Intl.NumberFormat(locale).format(count)} ${this.translate(unitKey(id, count))}`;
	};

	/**
	 * Optional nickname shown next to the quantity for a few counts ("Four fours", "Eleven ones").
	 * It is a message named after the count, so translators decide the wording; most counts have none.
	 */
	getNickname = (count: number): string | undefined => messages[`fun_${count}_nickname`]?.();

	/**
	 * "2¹⁰" for a power_of_two definition whose count is an exact power of two, otherwise undefined.
	 * The kind also holds 32,767 and the 32-bit limits, which are not powers, so they get no chip.
	 */
	getPowerOfTwo = (kind: string, count: number): string | undefined => {
		if (snake(kind) !== 'power_of_two' || !Number.isSafeInteger(count) || count < 1)
			return undefined;
		const n = BigInt(count);
		if ((n & (n - 1n)) !== 0n) return undefined;
		return `2${superscript(n.toString(2).length - 1)}`;
	};

	/** FunNumberType from the API ("PowerOfTwo" or "power_of_two") -> "Powers of two". */
	getCategory = (kind: string): string => this.translate(`category_${snake(kind)}`);

	isLegalDocument = (document: string): document is LegalDocument => {
		return Object.hasOwn(LEGAL_PAGES, document);
	};

	getLegalMeta = (document: string) => {
		if (!this.isLegalDocument(document)) return;
		const page = LEGAL_PAGES[document];
		return {
			title: this.translate(page.title),
			description: this.translate(page.description)
		};
	};
}

export const translatorService = new TranslatorService();
