<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { ApiService } from '$lib/services/api.service';
	import { EntitlementsUtils } from '$lib/utils/entitlements.utils';

	// Same shape the API returns for the session
	type View = { kind: 'working' } | { kind: 'failed'; reason: string } | { kind: 'timeout' };

	let view = $state<View>({ kind: 'working' });
	const apiService = new ApiService();

	const run = async () => {
		const token = page.url.searchParams.get('token');
		try {
			if (!token) {
				const session = await apiService.getSession();
				if (session.authenticated) return await EntitlementsUtils.goHome(session.entitlements);
				view = { kind: 'failed', reason: 'Missing verification token' };
				return;
			}

			await apiService.postVerifyLink(token);

			//API redirect, maybe should let FE do it
			const session = await apiService.getSession();
			if (session.authenticated) return await EntitlementsUtils.goHome(session.entitlements);
			view = { kind: 'timeout' };
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
