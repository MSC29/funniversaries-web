<script lang="ts">
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

	const run = async (isCancelled: () => boolean) => {
		const token = page.url.searchParams.get('t');
		try {
			if (!token) {
				const session = await apiService.getSession();
				if (session.authenticated) return await EntitlementsUtils.goHome(session.entitlements);
				view = { kind: 'failed', reason: 'Missing claim token' };
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
					view = { kind: 'failed', reason: 'Session cookie was not received' };
					return;
				}
				if (result.status === 'failed') {
					view = { kind: 'failed', reason: result.reason };
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
			view = { kind: 'failed', reason: 'Network error, please retry' };
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
	<p role="status">Confirming your payment…</p>
{:else if view.kind === 'failed'}
	<p role="alert">We could not complete your claim: {view.reason}</p>
{:else}
	<p role="status">
		Still processing. Your payment went through.
		<button onclick={() => location.reload()}>Check again</button>
	</p>
{/if}
