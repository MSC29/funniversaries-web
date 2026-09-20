<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {
		upcoming,
		select,
		splitHeadline,
		countdown,
		longDate,
		shortDate,
		fmt,
		DEFAULT_ORIGIN
	} from '$lib/milestones';

	let origin = $state(DEFAULT_ORIGIN);
	let now = $state(Date.now());

	const all = $derived(upcoming(origin, now));
	const picks = $derived(select(all, 4, now));
	const hero = $derived(picks[0]);
	const rest = $derived(picks.slice(1, 4));

	const examples = [
		{ label: 'Moon landing', date: '1969-07-20' },
		{ label: 'The day the web went public', date: '1991-08-06' },
		{ label: 'Y2K', date: '2000-01-01' }
	];
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
			666 days together. A billion seconds alive. 1,000 weeks at the same job. Pick a date and we'll
			find every number worth throwing a party for.
		</p>

		<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
			<input
				type="date"
				bind:value={origin}
				aria-label="The date you're counting from"
				style="background:var(--surface-2);border:1px solid var(--line-2);border-radius:12px;color:var(--ink);font-family:inherit;font-size:16px;padding:13px 15px;color-scheme:dark;min-height:48px;box-sizing:border-box"
			/>
			<button
				onclick={() => goto(resolve('/d/' + origin, {}))}
				style="font-size:16px;font-weight:600;color:var(--bg);background:var(--accent);border:0;border-radius:12px;padding:14px 22px;cursor:pointer;min-height:48px"
				>Find my milestones</button
			>
		</div>

		<div
			style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:14px;color:var(--muted-3)"
		>
			<span>Try:</span>
			{#each examples as ex}
				<button
					onclick={() => (origin = ex.date)}
					style="font-size:14px;color:var(--ink-2);background:var(--surface-2);border:1px solid var(--line-2);border-radius:999px;padding:7px 13px;cursor:pointer"
					>{ex.label}</button
				>
			{/each}
		</div>
	</div>

	{#if hero}
		{@const h = splitHeadline(hero.headline)}
		<div
			style="background:linear-gradient(160deg,#16233D,#121D33);border:1px solid #27385A;border-radius:20px;padding:28px 26px;display:flex;flex-direction:column;gap:16px;min-width:0;container-type:inline-size"
		>
			<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
				<span
					style="font-size:12px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:var(--bg);background:var(--accent);border-radius:999px;padding:5px 11px"
					>{hero.category}</span
				>
				<span style="font-size:13px;color:var(--muted-2)">{countdown(hero.ms, now)}</span>
			</div>
			<div>
				<div
					style="font-size:clamp(32px,11.5cqw,66px);line-height:0.98;font-weight:700;letter-spacing:-0.035em;font-variant-numeric:tabular-nums;overflow-wrap:anywhere"
				>
					{h.number}
				</div>
				<div
					style="font-size:clamp(18px,4cqw,24px);font-weight:500;color:var(--ink-2);margin-top:6px"
				>
					{h.unit}
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
				{#each rest as m}
					<div style="display:flex;gap:12px;align-items:baseline;justify-content:space-between">
						<span
							style="font-size:16px;font-weight:600;letter-spacing:-0.015em;font-variant-numeric:tabular-nums;overflow-wrap:anywhere"
							>{m.headline}</span
						>
						<span style="font-size:13px;color:var(--muted-2);white-space:nowrap"
							>{shortDate(m.ms)}</span
						>
					</div>
				{/each}
				<div style="font-size:13px;color:var(--muted-3);padding-top:2px">
					{fmt(all.length)} more milestones from this date
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
