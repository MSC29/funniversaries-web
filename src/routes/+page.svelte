<script lang="ts">
	import { resolve } from '$app/paths';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import MilestoneCalculator from '$lib/components/MilestoneCalculator.svelte';
	import { dateTypes, type DateTypeCalculator } from '$lib/content/dateTypes';

	let data: DateTypeCalculator = dateTypes[0];
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

<Header />

<MilestoneCalculator dataType={data}></MilestoneCalculator>

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
