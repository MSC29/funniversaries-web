<script lang="ts">
	let { data } = $props();

	console.log('legal');
	console.log(data.title);
	console.log(data.description);
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
</svelte:head>

{@html data.loadDocument}

<style>
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-family: Arial, sans-serif;
		font-weight: 700;
		line-height: 1.25;
		margin: 1.2em 0 0.5em;
	}

	h1 {
		font-size: 2rem;
	}
	h2 {
		font-size: 1.65rem;
	}
	h3 {
		font-size: 1.35rem;
	}
	h4 {
		font-size: 1.15rem;
	}
	h5 {
		font-size: 1rem;
	}
	h6 {
		font-size: 0.9rem;
	}
</style>
