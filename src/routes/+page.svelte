<script lang="ts">
	import MilestoneCalculator from '$lib/components/MilestoneCalculator.svelte';
	import { dateTypes, type DateTypeCalculator } from '$lib/content/dateTypes';
	import { date } from '$lib/i18n/format';

	let data: DateTypeCalculator = dateTypes[0];
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

<h2>+page hello</h2>
<p>{date(new Date('2026-11-29'))}</p>

<MilestoneCalculator dataType={data}></MilestoneCalculator>
