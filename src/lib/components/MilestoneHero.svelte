<script lang="ts">
	import type { Anniversary } from '$lib/entities/anniversary.entity';
	import { countdown, longDate, shortDate } from '$lib/milestones';

	interface Props {
		heroAnniversary: Anniversary;
		now: number;
		nextAnniversaries: Anniversary[];
	}

	let { heroAnniversary, now, nextAnniversaries }: Props = $props();
</script>

<div
	style="background:linear-gradient(160deg,#16233D,#121D33);border:1px solid #27385A;border-radius:20px;padding:28px 26px;display:flex;flex-direction:column;gap:16px;min-width:0;container-type:inline-size"
>
	<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
		<span
			style="font-size:12px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:var(--bg);background:var(--accent);border-radius:999px;padding:5px 11px"
			>{heroAnniversary.funNumber.type}</span
		>
		<span style="font-size:13px;color:var(--muted-2)">{countdown(heroAnniversary.date, now)}</span>
	</div>
	<div>
		<div
			style="font-size:clamp(32px,11.5cqw,66px);line-height:0.98;font-weight:700;letter-spacing:-0.035em;font-variant-numeric:tabular-nums;overflow-wrap:anywhere"
		>
			{heroAnniversary.funNumber.title}
		</div>
		<div style="font-size:clamp(18px,4cqw,24px);font-weight:500;color:var(--ink-2);margin-top:6px">
			{heroAnniversary.unit}
		</div>
	</div>
	<div style="font-size:15px;color:#E3E9F5;font-weight:500">{longDate(heroAnniversary.date)}</div>
	<p style="margin:0;font-size:15px;line-height:1.55;color:var(--muted);text-wrap:pretty">
		{heroAnniversary.funNumber.label}
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
