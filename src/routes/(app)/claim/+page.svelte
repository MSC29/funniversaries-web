<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { ApiService } from '$lib/services/api.service';
	import { EntitlementsUtils } from '$lib/utils/entitlements.utils';

	const MAX_ATTEMPTS = 20;
	const DELAY_MS = 1500;

	// Same shape the API returns for the session
	type View = { kind: 'working' } | { kind: 'failed'; reason: string } | { kind: 'timeout' };

	let view = $state<View>({ kind: 'working' });
	const apiService = new ApiService();

	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	const reasonMessage = {
		invalid_request: m.claim_reason_api_invalid_request(),
		service_unavailable: m.claim_reason_api_service_unavailable(),
		internal_error: m.claim_reason_api_internal_error()
	} as const;

	function getReason(reason: keyof typeof reasonMessage) {
		return reasonMessage[reason];
	}

	const run = async (isCancelled: () => boolean) => {
		const token = page.url.searchParams.get('t');
		try {
			if (!token) {
				const session = await apiService.getSession();
				if (session.authenticated) return await EntitlementsUtils.goHome(session.entitlements);
				view = { kind: 'failed', reason: m.claim_reason_missing_token() };
				return;
			}

			// Always claim first: a returning buyer already has a session, but this
			// token belongs to a NEW purchase that still has to be attached to it.
			for (let attempt = 0; attempt < MAX_ATTEMPTS && !isCancelled(); attempt++) {
				const result = await apiService.postClaim({ token }); // must not throw on 202 / 409
				if (result.status === 'claimed') {
					const session = await apiService.getSession();
					if (session.authenticated) return await EntitlementsUtils.goHome(session.entitlements);
					// Claimed server-side but the browser has no session: a cookie problem
					view = { kind: 'failed', reason: m.claim_reason_cookie_not_received() };
					return;
				}
				if (result.status === 'failed') {
					view = { kind: 'failed', reason: getReason(result.reason) };
					return;
				}
				await sleep(DELAY_MS); // pending: webhooks have not landed yet
			}
			if (isCancelled()) return;

			// Out of attempts. A reload after a successful claim ends up here: the token is
			// spent, so /claim keeps saying pending, but the session already has the purchase.
			const session = await apiService.getSession();
			if (session.authenticated) return await EntitlementsUtils.goHome(session.entitlements);
			view = { kind: 'timeout' };
		} catch {
			view = { kind: 'failed', reason: m.claim_reason_other() };
		}
	};

	onMount(() => {
		let cancelled = false;
		void run(() => cancelled);
		return () => {
			cancelled = true;
		};
	});
</script>

{#if view.kind === 'working'}
	<p role="status">{m.claim_working()}</p>
{:else if view.kind === 'failed'}
	<p role="alert">{m.claim_failed({ reason: view.reason })}</p>
{:else}
	<p role="status">
		{m.claim_payment_still_processing()}
		<button onclick={() => location.reload()}>{m.claim_action_check_again()}</button>
	</p>
{/if}
