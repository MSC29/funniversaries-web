export type Entitlement =
	{ scope: 'single-date'; date: string } | { scope: 'all-dates'; date: null };

export type SessionResponse =
	{ authenticated: false } | { authenticated: true; entitlements: Entitlement[] }; // newest purchase first
