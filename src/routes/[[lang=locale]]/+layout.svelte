<!-- [lang=locale]/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { LOCALES, DEFAULT } from '$lib/i18n/config';
	import { prefs } from '$lib/i18n/prefs.svelte.js';
	onMount(() => prefs.init());
	import { urlFor } from '$lib/seo';
	import { onMount } from 'svelte';
	let { data, children } = $props();
	const slug = $derived(page.params.slug);
</script>

<svelte:head>
	<link rel="canonical" href={urlFor(data.locale, slug)} />
	{#each LOCALES as l}
		<link rel="alternate" hreflang={l} href={urlFor(l, slug)} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={urlFor(DEFAULT, slug)} />
</svelte:head>
{@render children()}
