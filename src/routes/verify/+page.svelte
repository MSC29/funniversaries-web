<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ApiService } from '$lib/services/api.service';
	import type { Entitlement } from '$lib/responses/session.response';

	// Same shape the API returns for the session
	type View = { kind: 'working' } | { kind: 'failed'; reason: string } | { kind: 'timeout' };

	let view = $state<View>({ kind: 'working' });
	const apiService = new ApiService();

	// Entitlements come newest purchase first, so [0] is what was just claimed.
	// The date is already a YYYY-MM-DD day key: slice(0, 10) also tolerates old ISO values
	// and avoids new Date('YYYY-MM-DD'), which parses as UTC and can shift the day.
	const goHome = async (entitlements: Entitlement[]) => {
		const latest = entitlements[0];
		const query = latest?.scope === 'single-date' ? `?date=${latest.date}` : '';
		// replaceState: Back must not return to /claim (the token is spent).
		// invalidateAll: layout loads that ran before the cookie existed must re-run.
		await goto(resolve(`/${query}`, {}), { replaceState: true, invalidateAll: true });
	};

	const run = async () => {
		const token = page.url.searchParams.get('token');
		try {
			if (!token) {
				const session = await apiService.getSession();
				if (session.authenticated) return await goHome(session.entitlements);
				view = { kind: 'failed', reason: 'Missing verification token' };
				return;
			}

			await apiService.postVerifyLink(token);

			//API redirect, maybe should let FE do it
			// const session = await apiService.getSession();
			// if (session.authenticated) return await goHome(session.entitlements);
			// view = { kind: 'timeout' };
		} catch {
			view = { kind: 'failed', reason: 'Network error, please retry' };
		}
	};

	onMount(() => {
		void run();
	});
</script>

{#if view.kind === 'working'}
	<p role="status">Confirming your token</p>
{:else if view.kind === 'failed'}
	<p role="alert">There was a problem with your verification link: {view.reason}</p>
{:else}
	<p role="status">
		Still processing. Your payment went through.
		<button onclick={() => location.reload()}>Check again</button>
	</p>
{/if}
