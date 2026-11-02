<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '#lib/paraglide/messages.js';
	import { DatesService } from '#lib/services/dates.service.ts';
	import { celebrants } from '#lib/stores/celebrants.svelte.ts';

	interface Props {
		dateSelected: Date;
		postPricing: (type: string) => Promise<void>;
	}

	let { dateSelected, postPricing }: Props = $props();

	const day = $derived(new DatesService().getDateString(dateSelected));
	// "Just Léa & Tom" when names were typed, else the generic plan name
	const singleName = $derived(
		celebrants.get(day).trim()
			? m.plan_date_name_who({ who: celebrants.get(day).trim() })
			: m.plan_date_name()
	);

	const postPricingSingleDate: () => Promise<void> = async () => {
		await postPricing('single-date');
	};
	const postPricingAllDates: () => Promise<void> = async () => {
		await postPricing('all-dates');
	};
</script>

<section class="fv-card fv-card--ink fv-card--hero mt-10 flex flex-col gap-6 p-8 sm:p-10">
	<div class="flex flex-col gap-2">
		<h2 class="fv-display m-0 text-[clamp(2rem,4vw,2.5rem)]">{m.paywall_party_title()}</h2>
		<p class="m-0 text-lg leading-relaxed opacity-90">{m.paywall_sub({ max: '200' })}</p>
	</div>

	<div class="grid gap-5 sm:grid-cols-2">
		<div class="fv-card flex flex-col gap-2.5 p-7">
			<span class="font-bold">{singleName}</span>
			<span class="fv-display text-6xl">$4</span>
			<p class="fv-soft m-0 leading-snug">{m.plan_date_blurb()}</p>
			<button class="fv-btn mt-auto" onclick={postPricingSingleDate}
				>{m.plan_date_cta_short()}</button
			>
		</div>

		<div class="fv-card fv-card--sun relative flex flex-col gap-2.5 p-7">
			<span class="fv-pill fv-pill--coral absolute -top-4 right-5 rotate-3 normal-case"
				>{m.plan_all_badge()}</span
			>
			<span class="font-bold">{m.plan_all_name_love()}</span>
			<span class="fv-display text-6xl">$10</span>
			<p class="m-0 leading-snug">{m.plan_all_blurb()}</p>
			<button class="fv-btn fv-btn--ink mt-auto" onclick={postPricingAllDates}
				>{m.plan_all_cta_short()}</button
			>
		</div>
	</div>

	<p class="m-0 text-sm opacity-90">
		{m.paywall_fine()}
		<a href={resolve('/pricing')} class="text-inherit underline">{m.paywall_pricing_link()}</a>
	</p>
</section>
