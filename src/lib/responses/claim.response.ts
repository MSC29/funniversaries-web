export type ClaimResponse =
	| { status: 'pending' }
	| { status: 'claimed' }
	| { status: 'failed'; reason: 'invalid_request' | 'service_unavailable' | 'internal_error' };
