import { browser } from '$app/env';
import { m } from '#lib/paraglide/messages.js';

/**
 * Names typed in "Who's celebrating?", kept per date on this device only.
 * They never go into the URL, the API or analytics; they only end up on the
 * share picture the person downloads (and, later, on merch they choose to order).
 */
const KEY = 'fv:who';

function load(): Record<string, string> {
	try {
		return JSON.parse(localStorage.getItem(KEY) ?? '{}');
	} catch {
		return {};
	}
}

class Celebrants {
	// Read once at start-up (never from inside a $derived: Svelte forbids writes there).
	#byDate = $state<Record<string, string>>(browser ? load() : {});

	/** Raw value for the input ("" when nothing typed). */
	get(day: string): string {
		return this.#byDate[day] ?? '';
	}

	/** Display value: the names, or a friendly fallback ("You two"). */
	who(day: string): string {
		return this.get(day).trim() || m.who_fallback();
	}

	set(day: string, names: string) {
		this.#byDate = { ...this.#byDate, [day]: names.slice(0, 32) };
		try {
			localStorage.setItem(KEY, JSON.stringify(this.#byDate));
		} catch {
			/* private mode: keep it in memory */
		}
	}
}

export const celebrants = new Celebrants();
