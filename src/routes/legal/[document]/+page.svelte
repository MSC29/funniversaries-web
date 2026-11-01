<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
</svelte:head>

<main class="legal">
	<!-- eslint-disable-next-line svelte/no-at-html-tags, svelte/no-at-html-tags -->
	{@html data.loadDocument}
</main>
