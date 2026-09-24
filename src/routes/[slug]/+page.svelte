<!-- src/routes/[slug]/+page.svelte -->
<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import MilestoneCalculator from '$lib/components/MilestoneCalculator.svelte';
	import type { DateTypeCalculator } from '$lib/content/dateTypes';
	import Footer from '$lib/components/Footer.svelte';

	export let data: DateTypeCalculator;
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<meta property="og:title" content="Your next weird anniversary is closer than you think." />
	<meta
		property="og:description"
		content="Pick a date and we'll find every number worth throwing a party for."
	/>
</svelte:head>

<Header />

<MilestoneCalculator dataType={data}></MilestoneCalculator>

<Footer />
