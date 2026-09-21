<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Datepicker } from 'flowbite-svelte';
	import {
		upcoming,
		select,
		countdown,
		longDate,
		shortDate,
		DEFAULT_ORIGIN
	} from '$lib/milestones';
	import * as lib from '@msc29/funniversaries-wasm';

	import { DatesService } from '$lib/services/dates.service';

	import type { TimeEntity } from '$lib/entities/time.entity';
	import type {
		Anniversary,
		AnniversaryExample,
		AnniversaryPayload
	} from '$lib/entities/anniversary.entity';

	let dateService: DatesService;

	let dateReactive = $derived(new Date());

	let heroAnniversary: Anniversary | undefined = $state<Anniversary>();
	let nextAnniversaries: Anniversary[] = $state([]);

	const findAnniversaries: () => Promise<void> = async () => {
		console.log(`findAnniversaries ${dateReactive.toISOString()}`);
		// generateDates(dateReactive);
		const generatedAnniversaries: AnniversaryPayload[] = await lib.compute_preview(
			dateReactive.toISOString()
		);
		console.log(generatedAnniversaries.length);

		//filtering out invalid/useless JS dates
		const lifetime: number = new Date().getFullYear() + 50;
		const validAnniversaries: Anniversary[] = [];

		generatedAnniversaries
			// .filter((item: Anniversary | undefined): item is Anniversary => item !== undefined);
			.forEach((a: AnniversaryPayload) => {
				if (!a) {
					return undefined;
				}

				const dateObj: Date = new Date(a.date);
				if (
					dateObj instanceof Date &&
					!isNaN(dateObj.valueOf()) &&
					dateObj.getFullYear() < lifetime
				) {
					const annif: Anniversary = {
						date: dateObj,
						unit: a.unit,
						funNumber: a.fun_number
					};
					validAnniversaries.push(annif);
				}
			});

		//anniversaries are coming back sorted, but we're changing the sort order here
		const anniversariesSorted: Anniversary[] = validAnniversaries.sort(
			(a: Anniversary, b: Anniversary) => a.date.getTime() - b.date.getTime()
		);

		heroAnniversary = anniversariesSorted[0];
		nextAnniversaries[0] = anniversariesSorted[1];
		nextAnniversaries[1] = anniversariesSorted[2];
		nextAnniversaries[2] = anniversariesSorted[3];
	};

	let origin = $state(DEFAULT_ORIGIN);
	let now = $state(Date.now());

	const all = $derived(upcoming(origin, now));
	const picks = $derived(select(all, 4, now));
	const hero = $derived(picks[0]);

	const examples: AnniversaryExample[] = [
		{ id: 1, title: 'The day the web went public', date: new Date('1991-08-06') },
		{ id: 2, title: 'Y2K', date: new Date('2000-01-01') },
		{ id: 3, title: 'Bitcoin launched', date: new Date('2009-01-03') }
	];

	onMount(async () => {
		dateService = new DatesService();

		const time: TimeEntity = dateService.init_time();
		dateReactive = time.now;

		await lib.default();
	});

	function selectExample(ex: AnniversaryExample): void {
		dateReactive = ex.date!;
		findAnniversaries();
	}
</script>

<svelte:head>
	<title>Funniversaries — your next weird anniversary</title>
	<meta
		name="description"
		content="Pick a date and find every number worth throwing a party for: 666 days, a billion seconds, 1,000 weeks."
	/>
	<meta property="og:title" content="Your next weird anniversary is closer than you think." />
	<meta
		property="og:description"
		content="Pick a date and we'll find every number worth throwing a party for."
	/>
</svelte:head>

<Header>
	<a href={resolve('/pricing', {})} style="color:var(--muted)">Pricing</a>
</Header>

<section
	style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:36px;align-items:center"
>
	<div style="display:flex;flex-direction:column;gap:22px;min-width:0">
		<h1
			style="margin:0;font-size:clamp(32px,4.6vw,48px);line-height:1.06;font-weight:700;letter-spacing:-0.04em;text-wrap:balance"
		>
			Your next weird anniversary is closer than you think.
		</h1>
		<p
			style="margin:0;font-size:18px;line-height:1.55;color:var(--muted);max-width:46ch;text-wrap:pretty"
		>
			1000 days together. A billion seconds alive. 1,000 weeks at the same job. Pick a date and
			we'll find every number worth throwing a party for.
		</p>

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

	{#if heroAnniversary}
		<!-- {@const h = splitHeadline(heroAnniversary.headline)} -->
		<div
			style="background:linear-gradient(160deg,#16233D,#121D33);border:1px solid #27385A;border-radius:20px;padding:28px 26px;display:flex;flex-direction:column;gap:16px;min-width:0;container-type:inline-size"
		>
			<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
				<span
					style="font-size:12px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:var(--bg);background:var(--accent);border-radius:999px;padding:5px 11px"
					>{heroAnniversary.funNumber.type}</span
				>
				<span style="font-size:13px;color:var(--muted-2)">{countdown(hero.ms, now)}</span>
			</div>
			<div>
				<div
					style="font-size:clamp(32px,11.5cqw,66px);line-height:0.98;font-weight:700;letter-spacing:-0.035em;font-variant-numeric:tabular-nums;overflow-wrap:anywhere"
				>
					{heroAnniversary.funNumber.title}
				</div>
				<div
					style="font-size:clamp(18px,4cqw,24px);font-weight:500;color:var(--ink-2);margin-top:6px"
				>
					{heroAnniversary.unit}
				</div>
			</div>
			<div style="font-size:15px;color:#E3E9F5;font-weight:500">{longDate(hero.ms)}</div>
			<p style="margin:0;font-size:15px;line-height:1.55;color:var(--muted);text-wrap:pretty">
				{hero.blurb}
			</p>

			<div
				style="border-top:1px solid #243450;padding-top:14px;display:flex;flex-direction:column;gap:10px"
			>
				<span
					style="font-size:12px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:var(--muted-3)"
					>Then</span
				>
				{#each nextAnniversaries as m (m.date)}
					<div style="display:flex;gap:12px;align-items:baseline;justify-content:space-between">
						<span
							style="font-size:16px;font-weight:600;letter-spacing:-0.015em;font-variant-numeric:tabular-nums;overflow-wrap:anywhere"
							>{m.funNumber.title}</span
						>
						<span style="font-size:13px;color:var(--muted-2);white-space:nowrap"
							>{shortDate(m.date)}</span
						>
					</div>
				{/each}
				<div style="font-size:13px;color:var(--muted-3);padding-top:2px">
					See every milestone for this date →
				</div>
			</div>
		</div>
	{/if}
</section>

<section
	style="background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:22px 24px;display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between"
>
	<div style="display:flex;flex-direction:column;gap:6px;min-width:0">
		<div style="font-size:20px;font-weight:600;letter-spacing:-0.02em">
			Free to look. $4 to see everything.
		</div>
		<p
			style="margin:0;font-size:15px;line-height:1.5;color:var(--muted);max-width:56ch;text-wrap:pretty"
		>
			The next 5 milestones for any date are free. $4 unlocks every milestone for that date, with
			reminders and a calendar export. Prints are always available either way.
		</p>
	</div>
	<a
		href={resolve('/pricing', {})}
		style="font-size:15px;font-weight:600;color:var(--bg);background:var(--accent);border-radius:12px;padding:13px 20px;min-height:46px;display:flex;align-items:center;text-decoration:none"
		>See pricing</a
	>
</section>

<Footer />
