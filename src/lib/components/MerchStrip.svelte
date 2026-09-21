<script lang="ts">
	import { resolve } from '$app/paths';

	// Affiliate print partners. Swap hrefs for your tracked links.
	let { milestone = '' } = $props();
	const partners = [
		{ id: 1, label: 'T-shirt' },
		{ id: 2, label: 'Mug' },
		{ id: 3, label: 'Cap' }
	];
	const link = (kind) =>
		'/out/print?product=' +
		encodeURIComponent(kind.toLowerCase()) +
		'&text=' +
		encodeURIComponent(milestone);
</script>

<div
	style="border-top:1px solid #243450;padding-top:16px;display:flex;flex-direction:column;gap:10px"
>
	<span style="font-size:12px;letter-spacing:0.09em;text-transform:uppercase;color:var(--muted-3)"
		>Print it on something</span
	>
	<div style="display:flex;flex-wrap:wrap;gap:8px">
		{#each partners as kind (kind.id)}
			<a
				href={resolve(link(kind), {})}
				rel="sponsored nofollow"
				style="font-size:14px;color:var(--ink-2);background:#1B2942;border:1px solid var(--line-2);border-radius:10px;padding:9px 14px"
				>{kind}</a
			>
		{/each}
	</div>
</div>
