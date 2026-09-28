import { PUBLIC_API_URL } from '$env/static/public';
import { UiError } from '$lib/entities/uierror.entity';

import type { CheckoutPayload } from '$lib/payloads/checkout.payload';
import type { ClaimPayload } from '$lib/payloads/claim.payload';
import type { ResendAccessPayload } from '$lib/payloads/resendAccess.payload';
import type { CheckoutResponse } from '$lib/responses/checkout.response';
import type { ClaimResponse } from '$lib/responses/claim.response';
import type { SessionResponse } from '$lib/responses/session.response';

export class ApiService {
	constructor() {}

	async postCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
		const res: Response = await fetch(`${PUBLIC_API_URL}/checkout`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			throw new UiError('An error happened during checkout, please try again.');
		}

		return await res.json();
	}

	/** Call once on app boot. The HttpOnly cookie rides along automatically. */
	async getSession(): Promise<SessionResponse> {
		const res: Response = await fetch(`${PUBLIC_API_URL}/session`, {
			credentials: 'include'
		});

		if (!res.ok) {
			throw new UiError('Could not check your access, please try again.');
		}

		return await res.json();
	}

	/**
	 * Exchanges the one-time claim token (from the checkout redirect) for a
	 * session. `credentials: 'include'` is what lets the browser accept the
	 * Set-Cookie on the response.
	 *
	 * The Worker answers 200 (claimed), 202 (webhook not landed yet) or
	 * 409 (activation failed) — all three carry a JSON body, so only
	 * unexpected statuses are treated as errors here.
	 */
	async postClaim(payload: ClaimPayload): Promise<ClaimResponse> {
		const res: Response = await fetch(`${PUBLIC_API_URL}/claim`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (![200, 202, 409].includes(res.status)) {
			throw new UiError('Could not confirm your purchase, please try again.');
		}

		return await res.json();
	}

	/** Recovery flow: the Worker always answers with the same generic message. */
	async postResendAccess(payload: ResendAccessPayload): Promise<void> {
		const res: Response = await fetch(`${PUBLIC_API_URL}/resend-access`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			throw new UiError('Could not send the link, please try again in a moment.');
		}
	}
}
