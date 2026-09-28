<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ApiService } from '$lib/services/api.service';
	import { UiError } from '$lib/entities/uierror.entity';

	const api = new ApiService();

	// The webhook usually lands before the redirect, but not always, so the
	// Worker answers "pending" until it has. Bounded poll: ~20 seconds.
	const POLL_INTERVAL_MS = 3000;
	const MAX_ATTEMPTS = 20;

	type ViewState =
		{ kind: 'confirming' } | { kind: 'failed'; message: string } | { kind: 'timeout' };

	let view: ViewState = { kind: 'confirming' };

	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	onMount(async () => {
		const token = new URL(window.location.href).searchParams.get('t');

		// Get the one-time token out of the address bar / history right away.
		history.replaceState(null, '', window.location.pathname);

		if (!token) {
			view = { kind: 'failed', message: 'This confirmation link is incomplete.' };
			return;
		}

		try {
			// A refresh after success lands here with a burned token; if the
			// cookie is already valid there is nothing left to claim.
			const existing = await api.getSession();
			if (existing.authenticated) {
				await goto(resolve('/', {}), { replaceState: true });
				return;
			}

			for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
				const result = await api.postClaim({ token });

				if (result.status === 'claimed') {
					await goto(resolve('/', {}), { replaceState: true });
					return;
				}
				if (result.status === 'failed') {
					view = {
						kind: 'failed',
						message:
							'We could not activate this purchase. If you already used this link, use "Resend my access link".'
					};
					return;
				}
				await sleep(POLL_INTERVAL_MS);
			}
			view = { kind: 'timeout' };
		} catch (e) {
			view = {
				kind: 'failed',
				message: e instanceof UiError ? e.message : 'Something went wrong, please try again.'
			};
		}
	});
</script>

{#if view.kind === 'confirming'}
	<p>Confirming your purchase…</p>
{:else if view.kind === 'timeout'}
	<p>
		Your payment is taking longer than usual to confirm. You can safely close this page: use "Resend
		my access link" in a minute with the email you paid with.
	</p>
{:else}
	<p>{view.message}</p>
{/if}
