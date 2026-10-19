<script lang="ts">
	import type { Anniversary } from '$lib/entities/anniversary.entity';
	import { formatRelativeDays, formatCalendarDate } from '$lib/dates';

	interface Props {
		heroAnniversary: Anniversary;
		topAnniversaries: Anniversary[];
		numberAnniversariesGenerated: number;
	}

	let { heroAnniversary, topAnniversaries, numberAnniversariesGenerated }: Props = $props();
</script>

<div
	style="background:linear-gradient(160deg,#16233D,#121D33);border:1px solid #27385A;border-radius:20px;padding:28px 26px;display:flex;flex-direction:column;gap:16px;min-width:0;container-type:inline-size"
>
	<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
		<span
			style="font-size:12px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:var(--bg);background:var(--accent);border-radius:999px;padding:5px 11px"
			>{formatCalendarDate(heroAnniversary.date, 'fr')}</span
		>
		<span style="font-size:13px;color:var(--muted-2)"
			>{formatRelativeDays(heroAnniversary.date)}</span
		>
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
	<div style="font-size:15px;color:#E3E9F5;font-weight:500"></div>

	<div
		style="border-top:1px solid #243450;padding-top:14px;display:flex;flex-direction:column;gap:10px"
	>
		<span
			style="font-size:12px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:var(--muted-3)"
			>Then</span
		>
		{#each topAnniversaries as m (m.id)}
			<div style="display:flex;gap:12px;align-items:baseline;justify-content:space-between">
				<span
					style="font-size:16px;font-weight:600;letter-spacing:-0.015em;font-variant-numeric:tabular-nums;overflow-wrap:anywhere"
					>{m.funNumber.title} {m.unit}</span
				>
				<span style="font-size:13px;color:var(--muted-2);white-space:nowrap"
					>{formatCalendarDate(m.date, 'fr')}</span
				>
			</div>
		{/each}
		<span
			style="font-size:12px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:var(--muted-3)"
			>discover over {numberAnniversariesGenerated} other anniversaries</span
		>

		<!-- <div style="font-size:13px;color:var(--muted-3);padding-top:2px">
			<button
				onclick={() => postPricingSingleDate()}
				style="font-size:15px;font-weight:600;color:var(--bg);background:var(--accent);border-radius:12px;padding:13px 20px;min-height:46px;align-items:center;text-decoration:none;cursor: pointer;"
				>See every milestone for this date</button
			>
		</div> -->
	</div>
</div>
