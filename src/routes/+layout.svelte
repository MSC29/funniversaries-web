<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { pwaInfo } from 'virtual:pwa-info';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { isBusy } from '$lib/utils/update.gate';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	let webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	let isOffline = $derived(false);
	$effect(() => {
		isOffline = !navigator.onLine;
	});

	const CHECK_EVERY_MS = 30 * 60 * 1000;

	let waiting = false; // a new service worker is installed and waiting
	let update: ((reloadPage?: boolean) => Promise<void>) | undefined;

	// Activate the waiting worker and reload, but only at a quiet moment.
	function applyIfSafe() {
		if (waiting && update && !isBusy(location.pathname)) void update(true);
	}

	// Quiet moment 1: right after a route change, the user is between tasks.
	afterNavigate(() => applyIfSafe());

	onMount(() => {
		if (!pwaInfo) return;

		let timer: ReturnType<typeof setInterval> | undefined;
		const sw = useRegisterSW({
			immediate: true,
			onRegistered(registration) {
				if (!registration) return;
				timer = setInterval(() => registration.update(), CHECK_EVERY_MS);
				document.addEventListener('visibilitychange', () => {
					if (document.visibilityState === 'visible') registration.update();
				});
			},
			onRegisterError: (error) => console.error('SW registration error', error)
		});
		update = sw.updateServiceWorker;

		// needRefresh and offlineReady are stores: read them by subscribing, never with `if (store)`.
		const unsubscribe = [
			sw.offlineReady.subscribe((ready) => {
				if (ready) isOffline = true;
			}),
			sw.needRefresh.subscribe((isWaiting) => {
				waiting = isWaiting;
				if (isWaiting && document.hidden) applyIfSafe();
			})
		];

		// Quiet moment 2: the tab goes to the background, so nobody sees the reload.
		const onVisibility = () => {
			if (document.hidden) applyIfSafe();
		};
		document.addEventListener('visibilitychange', onVisibility);

		return () => {
			clearInterval(timer);
			unsubscribe.forEach((stop) => stop());
			document.removeEventListener('visibilitychange', onVisibility);
		};
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html webManifest}
</svelte:head>

<svelte:window ononline={() => (isOffline = false)} onoffline={() => (isOffline = true)} />

{#if isOffline}
	<!-- <p role="status">{m.offline_banner()}</p> -->
{/if}

<div style="min-height:100vh;background:var(--bg);padding:20px 20px 0;box-sizing:border-box">
	<div style="max-width:1120px;margin:0 auto;display:flex;flex-direction:column;gap:48px">
		<Header />
		{@render children()}
		<Footer />
	</div>
</div>
