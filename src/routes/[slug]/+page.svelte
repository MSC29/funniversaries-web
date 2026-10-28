<script lang="ts">
	import MilestoneCalculator from '$lib/components/MilestoneCalculator.svelte';
	import type { DateTypeCalculator } from '$lib/content/dateTypes';

	export let data: DateTypeCalculator;
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.description} />
</svelte:head>

<MilestoneCalculator dataType={data}></MilestoneCalculator>
