export type ClaimResponse =
	{ status: 'pending' } | { status: 'claimed' } | { status: 'failed'; reason: string };
