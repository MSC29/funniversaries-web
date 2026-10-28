<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	import { ApiService } from '$lib/services/api.service';
	import type { CheckoutPayload } from '$lib/payloads/checkout.payload';
	import type { CheckoutResponse } from '$lib/responses/checkout.response';
	import type { UiErrorEntity } from '$lib/entities/error.entity';
	import UiErrorMessage from '$lib/components/UiErrorMessage.svelte';

	let apiService: ApiService;
	let uiError: UiErrorEntity;

	//i18n
	// Prices in cents, shared with the preview paywall. Keep in sync with the Lemon Squeezy variants.
	const PRICES = { single: 400, all: 1000 };
	const money = (cents: number) => {
		const whole = cents % 100 === 0;
		return new Intl.NumberFormat(getLocale(), {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: whole ? 0 : 2,
			maximumFractionDigits: whole ? 0 : 2
		}).format(cents / 100);
	};
	const free = money(0);
	const single = money(PRICES.single);
	const all = money(PRICES.all);

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
	<title>{m.pricing_page_title()}</title>
	<meta name="description" content={m.pricing_meta_description({ price: single })} />
</svelte:head>

<section style="display:flex;flex-direction:column;gap:10px">
	<h1
		style="margin:0;font-size:clamp(30px,4.2vw,44px);font-weight:700;letter-spacing:-0.035em;text-wrap:balance"
	>
		{m.pricing_title({ price: single })}
	</h1>
	<p
		style="margin:0;font-size:17px;line-height:1.55;color:var(--muted);max-width:52ch;text-wrap:pretty"
	>
		{m.pricing_lead()}
	</p>
</section>

{#if uiError}
	<UiErrorMessage {uiError} />
{/if}

<section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px">
	<div
		style="background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:26px;display:flex;flex-direction:column;gap:14px"
	>
		<div style="font-size:18px;font-weight:600">{m.pricing_free_name()}</div>
		<div style="font-size:34px;font-weight:700;letter-spacing:-0.03em">{free}</div>
		<div
			style="display:flex;flex-direction:column;gap:9px;font-size:15px;color:var(--ink-2);line-height:1.45"
		>
			<span>{m.pricing_free_feature_preview()}</span>
			<span>{m.pricing_free_feature_share()}</span>
			<span>{m.pricing_free_feature_calendar()}</span>
		</div>
		<a
			href={resolve('/', {})}
			style="font-size:15px;font-weight:600;color:var(--ink);background:transparent;border:1px solid #38496E;border-radius:12px;padding:13px 18px;min-height:46px;margin-top:auto;display:flex;align-items:center;justify-content:center;text-decoration:none"
			>{m.pricing_free_cta()}</a
		>
	</div>

	<div
		style="background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:26px;display:flex;flex-direction:column;gap:14px"
	>
		<div style="font-size:18px;font-weight:600">{m.pricing_single_name()}</div>
		<div style="font-size:34px;font-weight:700;letter-spacing:-0.03em">{single}</div>
		<div
			style="display:flex;flex-direction:column;gap:9px;font-size:15px;color:var(--ink-2);line-height:1.45"
		>
			<span>{m.pricing_single_feature_all()}</span>
			<span>{m.pricing_single_feature_filter()}</span>
			<span>{m.pricing_single_feature_export()}</span>
			<span>{m.pricing_single_feature_reminder()}</span>
		</div>
		<a
			href={resolve('/', {})}
			style="font-size:15px;font-weight:600;color:var(--ink);background:transparent;border:1px solid #38496E;border-radius:12px;padding:13px 18px;min-height:46px;margin-top:auto;display:flex;align-items:center;justify-content:center;text-decoration:none"
			>{m.pricing_single_cta()}</a
		>
	</div>

	<div
		style="background:linear-gradient(160deg,#1B2A47,#131F37);border:1px solid var(--accent);border-radius:18px;padding:26px;display:flex;flex-direction:column;gap:14px"
	>
		<div style="display:flex;align-items:center;gap:10px">
			<span style="font-size:18px;font-weight:600">{m.pricing_all_name()}</span>
			<span
				style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--bg);background:var(--accent);border-radius:999px;padding:4px 9px"
				>{m.pricing_all_badge()}</span
			>
		</div>
		<div style="font-size:34px;font-weight:700;letter-spacing:-0.03em">{all}</div>
		<div
			style="display:flex;flex-direction:column;gap:9px;font-size:15px;color:#E3E9F5;line-height:1.45"
		>
			<span>{m.pricing_all_feature()}</span>
		</div>
		<button
			onclick={postPricing}
			style="font-size:15px;font-weight:600;color:var(--bg);background:var(--accent);border:0;border-radius:12px;padding:13px 18px;cursor:pointer;min-height:46px;margin-top:auto"
			>{m.pricing_all_cta({ price: all })}</button
		>
	</div>
</section>

<p style="margin:0;font-size:14px;color:var(--muted-3);max-width:60ch">
	{m.pricing_print_note()}
</p>
