<!-- src/routes/[slug]/+page.svelte -->
<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>{data.entry.title}</title>
	<meta name="description" content={data.entry.description} />
</svelte:head>

<h1>{data.entry.h1 ?? data.entry.title}</h1>
<p>{data.entry.subtitle}</p>

<!-- same hero/timeline component from earlier, just pre-flavored -->
<!-- <MilestoneCalculator
	prefillDate={data.kind === 'famous-date' ? data.entry.date : undefined}
	contextLabel={data.kind === 'date-type' ? data.entry.defaultLabel : undefined}
/> -->
