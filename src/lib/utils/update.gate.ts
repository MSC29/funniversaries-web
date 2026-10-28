// src/lib/update-gate.ts
// Decides whether a waiting service worker may be applied right now.
import { writable, get } from 'svelte/store';

const holds = writable(0);

/** Call while the user is mid-task (checkout open, form being filled). Call the returned function when done. */
export function holdUpdates(): () => void {
	holds.update((n) => n + 1);
	let released = false;
	return () => {
		if (released) return;
		released = true;
		holds.update((n) => n - 1);
	};
}

// Payment-return pages must never reload: they run a one-time confirmation.
// The pattern also matches locale-prefixed paths such as /fr/verify.
const NEVER_RELOAD = /\/(verify|claim)(\/|$)/;

export const isBusy = (pathname: string): boolean => get(holds) > 0 || NEVER_RELOAD.test(pathname);
