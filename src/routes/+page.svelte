<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import MilestoneCalculator from '$lib/components/MilestoneCalculator.svelte';
	import { dateTypes, type DateTypeCalculator } from '$lib/content/dateTypes';

	//default page, default DataType
	let data: DateTypeCalculator = dateTypes[0];
</script>

<svelte:head>
	<title>{m.meta_title()}</title>
	<meta name="description" content={m.meta_description()} />
	<meta property="og:title" content={m.meta_og_title()} />
	<meta property="og:description" content={m.meta_og_description()} />
</svelte:head>

<MilestoneCalculator dataType={data}></MilestoneCalculator>
