<script lang="ts">
	import MilestoneCalculator from '$lib/components/MilestoneCalculator.svelte';
	import { dateTypes, type DateTypeCalculator } from '$lib/content/dateTypes';
	// const locale = $derived(data.locale); // "en" | "fr"

	let dataTypes: DateTypeCalculator = dateTypes[0]; //default
</script>

<svelte:head>
	<title>Funniversaries — your next weird anniversary</title>
	<meta
		name="description"
		content="Pick a date and find every number worth throwing a party for: 666 days, a billion seconds, 1,000 weeks."
	/>
	<meta property="og:title" content="Your next weird anniversary is closer than you think." />
	<meta
		property="og:description"
		content="Pick a date and we'll find every number worth throwing a party for."
	/>
</svelte:head>

<MilestoneCalculator dataType={dataTypes}></MilestoneCalculator>
