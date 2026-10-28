<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
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
				view = { kind: 'failed', reason: m.verify_reason_missing_token() };
				return;
			}

			await apiService.postVerifyLink(token);

			//API redirect, maybe should let FE do it
			const session = await apiService.getSession();
			if (session.authenticated) return await EntitlementsUtils.goHome(session.entitlements);
			view = { kind: 'timeout' };
		} catch {
			view = { kind: 'failed', reason: m.verify_reason_other() };
		}
	};

	onMount(() => {
		void run();
	});
</script>

{#if view.kind === 'working'}
	<p role="status">{m.verify_working()}</p>
{:else if view.kind === 'failed'}
	<p role="alert">{m.verify_failed({ reason: view.reason })}</p>
{:else}
	<p role="status">
		{m.verify_pending()}
		<button onclick={() => location.reload()}>{m.verify_check_again()}</button>
	</p>
{/if}
