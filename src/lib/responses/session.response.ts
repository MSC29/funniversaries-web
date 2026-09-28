export type SessionResponse =
	| { authenticated: false }
	| { authenticated: true; scope: 'single-date'; date: string }
	| { authenticated: true; scope: 'all-dates'; date: null };
