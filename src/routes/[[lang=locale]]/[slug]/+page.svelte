<script lang="ts">
	import MilestoneCalculator from '$lib/components/MilestoneCalculator.svelte';
	import { dateTypes, type DateTypeCalculator } from '$lib/content/dateTypes';
	import { date } from '$lib/i18n/format.js';

	let { data } = $props();
	const locale = $derived(data.locale); // "en" | "fr"

	let dataTypes: DateTypeCalculator = dateTypes[0];
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

<h1>{locale} SLUG</h1>
<h1>{locale === 'fr' ? 'Calculateur' : 'Calculator'}</h1>
<p>{date(new Date('2026-11-29'))}</p>

<MilestoneCalculator dataType={dataTypes}></MilestoneCalculator>
