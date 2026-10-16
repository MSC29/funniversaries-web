import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { Entitlement } from '$lib/responses/session.response';

export class EntitlementsUtils {
	// Entitlements come newest purchase first, so [0] is what was just claimed.
	// The date is already a YYYY-MM-DD day key: slice(0, 10) also tolerates old ISO values
	// and avoids new Date('YYYY-MM-DD'), which parses as UTC and can shift the day.
	static goHome = async (entitlements: Entitlement[]) => {
		const latest = entitlements[0];
		const query = latest?.scope === 'single-date' ? `?date=${latest.date}` : '';
		// replaceState: Back must not return to /claim (the token is spent).
		// invalidateAll: layout loads that ran before the cookie existed must re-run.
		await goto(resolve(`/${query}`, {}), { replaceState: true, invalidateAll: true });
	};
}
