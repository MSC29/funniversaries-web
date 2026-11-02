<script lang="ts">
	import type {
		AnniversariesBucketEntity,
		AnniversaryEntity
	} from '#lib/entities/anniversary.entity.ts';
	import { horizonId, horizonLabel, pickHeadliner, snake } from '#lib/utils/fun.utils.ts';
	import { m } from '#lib/paraglide/messages.js';
	import HeadlinerCard from './HeadlinerCard.svelte';
	import MilestoneRow from './MilestoneRow.svelte';
	import MerchButton from '../merch/MerchButton.svelte';

	interface Props {
		bucket: AnniversariesBucketEntity;
		who: string;
		/** a kind ("meme_number") or "all" */
		kind: string;
		paid: boolean;
		/** milestone already shown at the top of the page, not repeated here */
		skip?: AnniversaryEntity;
		onshare: (a: AnniversaryEntity) => void;
	}

	let { bucket, who, kind, paid, skip, onshare }: Props = $props();

	const shown = $derived(
		bucket.anniversaries.filter(
			(a) => a !== skip && (kind === 'all' || snake(a.funNumber.kind) === kind)
		)
	);
	const headliner = $derived(pickHeadliner(shown));
	const rows = $derived(shown.filter((a) => a !== headliner));
	const countLabel = $derived(
		bucket.total === 1 ? m.results_count_one() : m.results_count({ count: String(bucket.total) })
	);
	const locked = $derived(paid ? 0 : Math.max(0, bucket.total - bucket.anniversaries.length));
	const placeholders = $derived(Array.from({ length: Math.min(locked, 3) }, (_, i) => i));
</script>

<section id={horizonId(bucket.horizon)} class="flex scroll-mt-40 flex-col gap-3.5 pt-4">
	<header class="flex flex-wrap items-baseline justify-between gap-3">
		<h2 class="fv-display m-0 text-[32px]">{horizonLabel(bucket.horizon)}</h2>
		<span class="fv-muted font-semibold">{countLabel}</span>
	</header>

	{#if headliner}
		<HeadlinerCard a={headliner} {who} label={m.results_headliner()} {onshare}>
			{#snippet actions()}<MerchButton a={headliner} />{/snippet}
		</HeadlinerCard>
	{/if}

	{#if rows.length}
		<ol class="fv-card fv-rows m-0 list-none overflow-hidden p-0">
			{#each rows as a (a.id)}
				<MilestoneRow {a} {who} {onshare} />
			{/each}
		</ol>
	{:else if !headliner && kind !== 'all'}
		<p class="fv-card fv-card--locked m-0 p-5">{m.results_empty_filter()}</p>
	{/if}

	{#if locked > 0}
		<div
			class="grid gap-3 sm:grid-cols-3"
			aria-label={m.results_locked_more({ count: String(locked) })}
		>
			{#each placeholders as i (i)}
				<div class="fv-card fv-card--locked flex flex-col gap-2 p-5" aria-hidden="true">
					<span class="fv-eyebrow fv-muted">{m.results_locked_title()}</span>
					<span class="fv-display fv-muted text-3xl tracking-[0.1em]">●●,●●●</span>
				</div>
			{/each}
		</div>
		<p class="fv-muted m-0 text-sm font-semibold">
			{m.results_locked_more({ count: String(locked) })}
		</p>
	{/if}
</section>
