<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		postPricing: (type: string) => Promise<void>;
	}

	let { postPricing }: Props = $props();

	const postPricingSingleDate: () => Promise<void> = async () => {
		await postPricing('single-date');
	};
	const postPricingAllDates: () => Promise<void> = async () => {
		await postPricing('all-dates');
	};
</script>

<section
	style="background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:22px 24px;display:flex;flex-direction:column;gap:18px"
>
	<div style="display:flex;flex-direction:column;gap:6px;min-width:0">
		<div style="font-size:20px;font-weight:600;letter-spacing:-0.02em">
			You're seeing a preview. Unlock every milestone for this date:
		</div>

		<p
			style="margin:0;font-size:15px;line-height:1.5;color:var(--muted);max-width:56ch;text-wrap:pretty"
		>
			The next 5 milestones for any date are free. Prints are always available either way.
		</p>
	</div>

	<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
		<!-- This date -->
		<div
			style="background:var(--bg);border:1px solid var(--accent);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:14px"
		>
			<div style="display:flex;flex-direction:column;gap:4px">
				<div style="font-size:15px;font-weight:600">This date</div>
				<div style="font-size:32px;font-weight:600;letter-spacing:-0.03em;line-height:1.1">$4</div>
				<p style="margin:0;font-size:14px;line-height:1.5;color:var(--muted)">
					Every milestone for this date, with reminders and a calendar export.
				</p>
			</div>
			<button
				onclick={postPricingSingleDate}
				style="margin-top:auto;font-size:15px;font-weight:600;color:var(--bg);background:var(--accent);border-radius:12px;padding:13px 20px;min-height:46px;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor: pointer;"
				>Unlock this date</button
			>
		</div>

		<!-- All dates -->
		<div
			style="background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:14px"
		>
			<div style="display:flex;flex-direction:column;gap:4px">
				<div style="font-size:15px;font-weight:600">All dates</div>
				<div style="font-size:32px;font-weight:600;letter-spacing:-0.03em;line-height:1.1">$10</div>
				<p style="margin:0;font-size:14px;line-height:1.5;color:var(--muted)">
					Every milestone for every date, with reminders and calendar exports.
				</p>
			</div>
			<button
				onclick={postPricingAllDates}
				style="margin-top:auto;font-size:15px;font-weight:600;color:inherit;background:transparent;border:1px solid var(--line);border-radius:12px;padding:13px 20px;min-height:46px;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor: pointer;"
				>Unlock all dates</button
			>
		</div>
	</div>

	<p style="margin:0;font-size:13px;color:var(--muted)">
		One-time payment, no subscription. Secure checkout by Lemon Squeezy.
		<a href={resolve('/pricing', {})} style="color:inherit;text-decoration:underline">See pricing</a
		>
	</p>
</section>
