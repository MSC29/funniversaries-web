<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import { formatDate } from '$lib/utils/dates';

	interface Props {
		dateSelected: Date;
		postPricing: (type: string) => Promise<void>;
	}

	let { dateSelected, postPricing }: Props = $props();

	const postPricingSingleDate: () => Promise<void> = async () => {
		await postPricing('single-date');
	};
	const postPricingAllDates: () => Promise<void> = async () => {
		await postPricing('all-dates');
	};
</script>

<section
	style="background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:22px 24px;display:flex;flex-direction:column;gap:18px"
	class="mt-6"
>
	<div style="display:flex;flex-direction:column;gap:6px;min-width:0">
		<div style="font-size:20px;font-weight:600;letter-spacing:-0.02em">
			{m.paywall_title({ date: formatDate(dateSelected) })}
		</div>

		<p style="margin:0;font-size:15px;line-height:1.5;color:var(--muted);">
			{m.paywall_sub({ max: '200' })}
		</p>
	</div>

	<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
		<!-- This date -->
		<div
			style="background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:14px"
		>
			<div style="display:flex;flex-direction:column;gap:4px">
				<div style="font-size:15px;font-weight:600">{m.plan_date_name()}</div>
				<div style="font-size:32px;font-weight:600;letter-spacing:-0.03em;line-height:1.1">$4</div>
				<p style="margin:0;font-size:14px;line-height:1.5;color:var(--muted)">
					{m.plan_date_blurb()}
				</p>
			</div>
			<button
				onclick={postPricingAllDates}
				style="margin-top:auto;font-size:15px;font-weight:600;color:inherit;background:transparent;border:1px solid var(--line);border-radius:12px;padding:13px 20px;min-height:46px;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor: pointer;"
				>{m.plan_date_cta({ price: '4$' })}</button
			>
		</div>

		<!-- All dates -->
		<div
			style="background:var(--bg);border:1px solid var(--accent);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:14px"
		>
			<div style="display:flex;flex-direction:column;gap:4px">
				<div style="font-size:15px;font-weight:600">{m.plan_all_name()}</div>
				<div style="font-size:32px;font-weight:600;letter-spacing:-0.03em;line-height:1.1">$10</div>
				<p style="margin:0;font-size:14px;line-height:1.5;color:var(--muted)">
					{m.plan_all_blurb()}
				</p>
			</div>
			<button
				onclick={postPricingSingleDate}
				style="margin-top:auto;font-size:15px;font-weight:600;color:var(--bg);background:var(--accent);border-radius:12px;padding:13px 20px;min-height:46px;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor: pointer;"
				>{m.plan_all_cta({ price: '10$' })}</button
			>
		</div>
	</div>

	<p style="margin:0;font-size:13px;color:var(--muted)">
		{m.paywall_fine()}
		<a href={resolve('/pricing', {})} style="color:inherit;text-decoration:underline"
			>{m.paywall_pricing_link()}</a
		>
	</p>
</section>
