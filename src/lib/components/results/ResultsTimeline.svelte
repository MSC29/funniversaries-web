<script lang="ts">
	import { TextPlaceholder } from 'flowbite-svelte';
	import { m } from '#lib/paraglide/messages.js';
	import type { AnniversariesEntity, AnniversaryEntity } from '#lib/entities/anniversary.entity.ts';
	import type { CalendarEvent } from '#lib/services/calendar.service.ts';
	import { translatorService } from '#lib/services/translator.service.ts';
	import { DatesService } from '#lib/services/dates.service.ts';
	import { celebrants } from '#lib/stores/celebrants.svelte.ts';
	import { formatDate } from '#lib/utils/dates.ts';
	import { horizonId, horizonLabel, snake } from '#lib/utils/fun.utils.ts';
	import AddToCalendar from '../AddToCalendar.svelte';
	import HeadlinerCard from './HeadlinerCard.svelte';
	import BucketSection from './BucketSection.svelte';
	import ShareCardEditor from '../share/ShareCardEditor.svelte';
	import MerchButton from '../merch/MerchButton.svelte';

	interface Props {
		anniversaries: AnniversariesEntity;
		dateSelected: Date;
		calendarEvents: CalendarEvent[];
		loading: boolean;
		paid: boolean;
	}

	let { anniversaries, dateSelected, calendarEvents, loading, paid }: Props = $props();

	const day = $derived(new DatesService().getDateString(dateSelected));
	const who = $derived(celebrants.who(day));

	const all = $derived(anniversaries.buckets.flatMap((b) => b.anniversaries));
	const nextUp = $derived(all[0]);

	// Filter chips: only the kinds that actually appear for this date.
	const kinds = $derived([...new Set(all.map((a) => snake(a.funNumber.kind)))]);
	let kind = $state('all');

	let sharing = $state<AnniversaryEntity | undefined>();
</script>

{#if loading}
	<div class="flex flex-col gap-4" aria-busy="true">
		<TextPlaceholder size="2xl" />
		<div class="fv-card fv-card--hero h-64"></div>
	</div>
{:else}
	<div class="flex flex-col gap-7">
		<header class="flex flex-wrap items-end justify-between gap-4">
			<div class="flex flex-col gap-2">
				<h2 class="fv-display m-0 text-[clamp(2.5rem,5.4vw,4rem)] text-balance">
					{m.results_title({ who })}
				</h2>
				<p class="fv-soft m-0 text-lg">{m.results_since({ date: formatDate(dateSelected) })}</p>
			</div>
			<AddToCalendar events={calendarEvents} />
		</header>

		{#if nextUp}
			<HeadlinerCard
				a={nextUp}
				{who}
				label={m.results_next_up()}
				hero
				onshare={(a) => (sharing = a)}
			>
				{#snippet actions()}<MerchButton a={nextUp} />{/snippet}
			</HeadlinerCard>
		{/if}

		<!-- sticky jump bar + kind filter -->
		<div class="fv-divider fv-on-cream sticky top-0 z-10 flex flex-col gap-2.5 py-3">
			<nav class="flex flex-wrap items-center gap-2" aria-label={m.results_jump_to()}>
				<span class="fv-eyebrow fv-muted me-1">{m.results_jump_to()}</span>
				{#each anniversaries.buckets as b (b.horizon)}
					<a class="fv-chip" href="#{horizonId(b.horizon)}">{horizonLabel(b.horizon)} · {b.total}</a
					>
				{/each}
			</nav>
			{#if kinds.length > 1}
				<div class="flex flex-wrap items-center gap-2" role="group" aria-label={m.results_show()}>
					<span class="fv-eyebrow fv-muted me-1">{m.results_show()}</span>
					<button class="fv-chip" aria-pressed={kind === 'all'} onclick={() => (kind = 'all')}>
						{m.results_filter_all()}
					</button>
					{#each kinds as k (k)}
						<button class="fv-chip" aria-pressed={kind === k} onclick={() => (kind = k)}>
							{translatorService.getCategory(k)}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		{#each anniversaries.buckets as bucket (bucket.horizon)}
			<BucketSection {bucket} {who} {kind} {paid} skip={nextUp} onshare={(a) => (sharing = a)} />
		{/each}
	</div>
{/if}

{#if sharing}
	<ShareCardEditor a={sharing} {day} {paid} onclose={() => (sharing = undefined)} />
{/if}
