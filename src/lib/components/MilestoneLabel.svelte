<script lang="ts">
	import { Datepicker } from 'flowbite-svelte';
	import type { AnniversaryExample } from '$lib/entities/anniversary.entity';
	import type { DateTypeCalculator } from '$lib/content/dateTypes';

	interface Props {
		dataType: DateTypeCalculator;
		findAnniversaries: () => Promise<void>;
		selectExample: (ex: AnniversaryExample) => Promise<void>;
		dateReactive: Date;
	}

	let {
		dataType,
		findAnniversaries,
		selectExample,
		dateReactive = $bindable<Date>(new Date())
	}: Props = $props();

	const examples: AnniversaryExample[] = [
		{ id: 1, title: 'The day the web went public', date: new Date('1991-08-06') },
		{ id: 2, title: 'Y2K', date: new Date('2000-01-01') },
		{ id: 3, title: 'Bitcoin launched', date: new Date('2009-01-03') }
	];
</script>

<div style="display:flex;flex-direction:column;gap:22px;min-width:0">
	<h1
		style="margin:0;font-size:clamp(32px,4.6vw,48px);line-height:1.06;font-weight:700;letter-spacing:-0.04em;text-wrap:balance"
	>
		{dataType.h1}
	</h1>
	<p
		style="margin:0;font-size:18px;line-height:1.55;color:var(--muted);max-width:46ch;text-wrap:pretty"
	>
		{dataType.subtitle}
	</p>

	<!-- <h1>{data.entry.h1 ?? data.entry.title}</h1>
<p>{data.entry.subtitle}</p> -->

	<!-- same hero/timeline component from earlier, just pre-flavored -->
	<!-- <MilestoneCalculator
	prefillDate={data.kind === 'famous-date' ? data.entry.date : undefined}
	contextLabel={data.kind === 'date-type' ? data.entry.defaultLabel : undefined}
/> -->

	<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
		<Datepicker
			inputProps={{
				id: 'date-picker',
				style:
					'background:var(--surface-2);border:1px solid var(--line-2);border-radius:12px;color:var(--ink);font-family:inherit;font-size:16px;padding:13px 15px;color-scheme:dark;min-height:48px;box-sizing:border-box'
			}}
			bind:value={dateReactive}
			onselect={findAnniversaries}
			dateFormat={{ year: 'numeric', month: 'short', day: '2-digit' }}
			placeholder="Type a date or use calendar"
			autohide={true}
			required
		/>
	</div>

	<div
		style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:14px;color:var(--muted-3)"
	>
		<span>Try:</span>
		{#each examples as ex (ex.id)}
			<button
				onclick={() => selectExample(ex)}
				style="font-size:14px;color:var(--ink-2);background:var(--surface-2);border:1px solid var(--line-2);border-radius:999px;padding:7px 13px;cursor:pointer"
				>{ex.title}</button
			>
		{/each}
	</div>
</div>
