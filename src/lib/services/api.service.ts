import { PUBLIC_API_URL } from '$env/static/public';
import { UiError } from '$lib/entities/uierror.entity';

import type { CheckoutPayload } from '$lib/payloads/checkout.payload';
import type { CheckoutResponse } from '$lib/responses/checkout.response';

export class ApiService {
	constructor() {}

	async postCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
		const res: Response = await fetch(`${PUBLIC_API_URL}/checkout`, {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			throw new UiError('An error happened during checkout, please try again.');
		}

		const response: CheckoutResponse = await res.json();
		return response;
	}
}
