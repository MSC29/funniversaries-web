<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';

	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	import { ApiService } from '#lib/services/api.service.ts';
	import type { CheckoutPayload } from '#lib/payloads/checkout.payload.ts';
	import type { CheckoutResponse } from '#lib/responses/checkout.response.ts';
	import type { UiErrorEntity } from '#lib/entities/error.entity.ts';
	import UiErrorMessage from '#lib/components/UiErrorMessage.svelte';

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
	// "Just Léa & Tom" when names were typed, else the generic plan name

	const postPricing: () => Promise<void> = async () => {
		try {
			const payload: CheckoutPayload = {
				date: undefined,
				scope: 'all-dates'
			};
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
	<p style="margin:0;font-size:17px;line-height:1.55;color:var(--muted);text-wrap:pretty">
		{m.pricing_lead()}
	</p>
</section>

{#if uiError}
	<UiErrorMessage {uiError} />
{/if}

<section>
	<div class="grid gap-5 sm:grid-cols-3">
		<div class="fv-card flex flex-col gap-2.5 p-7">
			<span class="font-bold">{m.pricing_free_name()}</span>
			<span class="fv-display text-6xl">{free}</span>
			<p class="fv-soft m-0 leading-snug">{m.pricing_free_feature_preview()}</p>
			<a class="fv-btn mt-auto" href={resolve('/')}>{m.pricing_free_cta()}</a>
		</div>
		<div class="fv-card flex flex-col gap-2.5 p-7">
			<span class="font-bold">{m.pricing_single_name()}</span>
			<span class="fv-display text-6xl">{single}</span>
			<p class="fv-soft m-0 leading-snug">{m.plan_date_blurb()}</p>
			<a class="fv-btn mt-auto" href={resolve('/')}>{m.pricing_single_cta()}</a>
		</div>

		<div class="fv-card fv-card--sun relative flex flex-col gap-2.5 p-7">
			<span class="fv-pill fv-pill--coral absolute -top-4 right-5 rotate-3 normal-case"
				>{m.plan_all_badge()}</span
			>
			<span class="font-bold">{m.plan_all_name_love()}</span>
			<span class="fv-display text-6xl">{all}</span>
			<p class="m-0 leading-snug">{m.plan_all_blurb()}</p>
			<button class="fv-btn fv-btn--ink mt-auto" onclick={postPricing}>{m.pricing_all_cta()}</button
			>
		</div>
	</div>

	<p class="mt-12 text-sm opacity-90">
		{m.paywall_fine()}
	</p>
	<p class="mt-5 text-sm opacity-90">
		{m.pricing_print_note()}
	</p>
</section>
