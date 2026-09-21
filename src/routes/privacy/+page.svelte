<script lang="ts">
	import { resolve } from '$app/paths';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Pricing — Funniversaries</title>
	<meta name="description" content="Free to look. $4 unlocks every milestone for a date." />
</svelte:head>

<Header>
	<a href={resolve('/', {})} style="color:var(--muted)">Home</a>
</Header>

<p style="margin:0;font-size:14px;color:var(--muted-3);max-width:60ch">Privacy</p>

<Footer />
