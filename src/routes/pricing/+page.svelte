<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	import { ApiService } from '$lib/services/api.service';
	import type { CheckoutPayload } from '$lib/payloads/checkout.payload';
	import type { CheckoutResponse } from '$lib/responses/checkout.response';
	import type { UiErrorEntity } from '$lib/entities/error.entity';
	import UiErrorMessage from '$lib/components/UiErrorMessage.svelte';

	let apiService: ApiService;
	let uiError: UiErrorEntity;

	onMount(async () => {
		apiService = new ApiService();
	});

	const postPricing: () => Promise<void> = async () => {
		try {
			const payload: CheckoutPayload = {
				date: undefined,
				scope: 'all-dates'
			};
			console.log(`posting ${payload.scope}`);
			const checkoutResponse: CheckoutResponse = await apiService.postCheckout(payload);
			window.location.assign(checkoutResponse.checkout_url); // full-page redirect to outside svelte (not using goto)
		} catch {
			uiError = {
				title: 'Checkout failed',
				message: 'Could not start the checkout. Please try again.'
			};
		}
	};
</script>

<svelte:head>
	<title>Pricing — Funniversaries</title>
	<meta name="description" content="Free to look. $4 unlocks every milestone for a date." />
</svelte:head>

<section style="display:flex;flex-direction:column;gap:10px">
	<h1
		style="margin:0;font-size:clamp(30px,4.2vw,44px);font-weight:700;letter-spacing:-0.035em;text-wrap:balance"
	>
		Free to look. $4 to see everything.
	</h1>
	<p
		style="margin:0;font-size:17px;line-height:1.55;color:var(--muted);max-width:52ch;text-wrap:pretty"
	>
		One payment per date, no subscription. Unlock the date you care about and keep it.
	</p>
</section>

{#if uiError}
	<UiErrorMessage {uiError} />
{/if}

<section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px">
	<div
		style="background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:26px;display:flex;flex-direction:column;gap:14px"
	>
		<div style="font-size:18px;font-weight:600">Free</div>
		<div style="font-size:34px;font-weight:700;letter-spacing:-0.03em">$0</div>
		<div
			style="display:flex;flex-direction:column;gap:9px;font-size:15px;color:var(--ink-2);line-height:1.45"
		>
			<span>The next 4 milestones for any date</span>
			<span>Shareable link</span>
			<span>Add a milestone to your calendar</span>
		</div>
		<a
			href={resolve('/', {})}
			style="font-size:15px;font-weight:600;color:var(--ink);background:transparent;border:1px solid #38496E;border-radius:12px;padding:13px 18px;min-height:46px;margin-top:auto;display:flex;align-items:center;justify-content:center;text-decoration:none"
			>Start with a date</a
		>
	</div>

	<div
		style="background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:26px;display:flex;flex-direction:column;gap:14px"
	>
		<div style="font-size:18px;font-weight:600">Single date</div>
		<div style="font-size:34px;font-weight:700;letter-spacing:-0.03em">$4</div>
		<div
			style="display:flex;flex-direction:column;gap:9px;font-size:15px;color:var(--ink-2);line-height:1.45"
		>
			<span>Every milestone for that date, to 2100</span>
			<span>Filter by unit and category</span>
			<span>Export the whole list to your calendar</span>
			<span>A reminder before each one</span>
		</div>
		<a
			href={resolve('/', {})}
			style="font-size:15px;font-weight:600;color:var(--ink);background:transparent;border:1px solid #38496E;border-radius:12px;padding:13px 18px;min-height:46px;margin-top:auto;display:flex;align-items:center;justify-content:center;text-decoration:none"
			>Pick the date</a
		>
	</div>

	<div
		style="background:linear-gradient(160deg,#1B2A47,#131F37);border:1px solid var(--accent);border-radius:18px;padding:26px;display:flex;flex-direction:column;gap:14px"
	>
		<div style="display:flex;align-items:center;gap:10px">
			<span style="font-size:18px;font-weight:600">Any date</span>
			<span
				style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--bg);background:var(--accent);border-radius:999px;padding:4px 9px"
				>One-off</span
			>
		</div>
		<div style="font-size:34px;font-weight:700;letter-spacing:-0.03em">$10</div>
		<div
			style="display:flex;flex-direction:column;gap:9px;font-size:15px;color:#E3E9F5;line-height:1.45"
		>
			<span>Every milestone for every date</span>
		</div>
		<button
			onclick={postPricing}
			style="font-size:15px;font-weight:600;color:var(--bg);background:var(--accent);border:0;border-radius:12px;padding:13px 18px;cursor:pointer;min-height:46px;margin-top:auto"
			>Unlock all dates — $10</button
		>
	</div>
</section>

<p style="margin:0;font-size:14px;color:var(--muted-3);max-width:60ch">
	Every milestone can be printed on a shirt, mug, cap or poster through our print partners. That
	part is always available, free or paid.
</p>
