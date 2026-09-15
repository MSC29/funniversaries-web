<script lang="ts">
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	import '../app.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
	let offline = $state(false);

	onMount(async () => {
		if (pwaInfo) {
			console.log('pwaInfo available');
			console.log(`pwa info link tag ${pwaInfo.webManifest.linkTag}`);

			const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
				immediate: true,
				onRegistered(r) {
					if (r) {
						setInterval(() => {
							console.log(`Checking for sw update: ${r}`);
							r.update();
						}, 20000 /* 20s for testing purposes */);
					}
					// r &&
					// 	setInterval(() => {
					// 		console.log(`Checking for sw update: ${r}`);
					// 		// since r.sync isn't avilable

					// 		r.update();
					// 	}, 20000 /* 20s for testing purposes */);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				},
				onOfflineReady() {
					console.log('SW ready for offline');
					// setTimeout(() => close(), 5000);
				}
			});

			if (needRefresh) {
				console.log('Updating sw');
				updateServiceWorker(true);
			}

			if (offlineReady) {
				console.log('Offline Ready: ' + offline);
				offline = true;
			}
		}
	});
</script>

<svelte:head>
	<title>Funniversaries — Celebrate the fun milestones</title>
	<meta
		name="description"
		content="Pick a date and discover the anniversaries worth celebrating!"
	/>
	{@html webManifest}
	<!-- {webManifest} -->
</svelte:head>

<main>
	<!-- <DarkMode /> -->
	<div style="height:100%;" class="pt-8 pr-5 pb-8 pl-5">
		{@render children?.()}
	</div>
</main>
