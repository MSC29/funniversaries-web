<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import type { AnniversaryEntity } from '#lib/entities/anniversary.entity.ts';
	import { formatDate } from '#lib/utils/dates.ts';
	import { merchEnabled, merchTiming, providers, type MerchProduct } from '#lib/merch/merch.ts';

	interface Props {
		a: AnniversaryEntity;
		product?: MerchProduct;
	}

	let { a, product = 'mug' }: Props = $props();

	// First partner that sells this product. Region matching comes with the first real partner.
	const provider = $derived(providers.find((p) => p.products.includes(product)));
	const timing = $derived(provider ? merchTiming(a, provider) : undefined);
</script>

{#if merchEnabled() && provider && timing && timing.state !== 'too-late'}
	<!-- eslint-disable svelte/no-navigation-without-resolve -- external partner link -->
	<a
		class="fv-btn {timing.state === 'last-call' ? 'fv-btn--sun' : ''}"
		href={provider.buildUrl({
			product,
			count: a.funNumber.count,
			unit: a.unit,
			kind: a.funNumber.kind
		})}
		target="_blank"
		rel="sponsored noopener"
	>
		{timing.state === 'last-call'
			? m.merch_last_call({ date: formatDate(timing.orderBy) })
			: m.action_merch()}
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
	<span class="fv-muted text-xs">{m.merch_disclosure()}</span>
{/if}
