<script lang="ts">
	import { Datepicker } from 'flowbite-svelte';
	import type { AnniversaryExample } from '$lib/entities/anniversary.entity';
	import type { DateTypeCalculator } from '$lib/content/dateTypes';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		dataType: DateTypeCalculator;
		selectExample: (ex: AnniversaryExample) => Promise<void>;
		dateReactive: Date;
		onchange?: (date: Date) => void;
	}

	let {
		dataType,
		selectExample,
		dateReactive = $bindable<Date>(new Date()),
		onchange
	}: Props = $props();

	$effect(() => console.log(`label date  ${dateReactive}`));

	function monthsAgo(months: number): Date {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const date = new Date();
		const day = date.getDate();

		date.setDate(1);
		date.setMonth(date.getMonth() - months);

		const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

		date.setDate(Math.min(day, lastDay));
		return date;
	}

	function pick(d: Date) {
		dateReactive = d;
		onchange?.(d);
	}

	const examples: AnniversaryExample[] = [
		{ id: 1, title: m.hero_label_milestone_example_1(), date: monthsAgo(2) },
		{ id: 2, title: m.hero_label_milestone_example_2(), date: monthsAgo(6) },
		{ id: 3, title: m.hero_label_milestone_example_3(), date: monthsAgo(12) }
	];
</script>

<div style="display:flex;flex-direction:column;gap:22px;min-width:0">
	<!-- <h1
		style="margin:0;font-size:clamp(32px,4.6vw,48px);line-height:1.06;font-weight:700;letter-spacing:-0.04em;text-wrap:balance"
	> -->
	<h1 style="font-size: clamp(2rem, 5vw + 0.5rem, 3.25rem); max-width: 30ch; text-wrap: balance;">
		{dataType.h1}
	</h1>
	<p
		style="margin:0;font-size:18px;line-height:1.55;color:var(--muted);max-width:46ch;text-wrap:pretty"
	>
		{dataType.subtitle}
	</p>

	<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
		<label for="dateinput" style="width:min(100%, 16rem);">{dataType.label}</label>
		<Datepicker
			id="dateinput"
			inputProps={{
				id: 'date-picker',
				style:
					'background:var(--surface-2);border:1px solid var(--line-2);border-radius:12px;color:var(--ink);font-family:inherit;font-size:16px;padding:13px 15px;color-scheme:dark;min-height:48px;box-sizing:border-box'
			}}
			bind:value={dateReactive}
			onselect={(d) => pick(d as Date)}
			dateFormat={{ year: 'numeric', month: 'short', day: '2-digit' }}
			placeholder={dataType.label}
			autohide={true}
			required
		/>
	</div>
	<div
		style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:14px;color:var(--muted-3)"
	></div>

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
