<script lang="ts">
	import { onMount } from 'svelte';
	import * as lib from '@msc29/funniversaries-wasm';

	import { DatesService } from '$lib/services/dates.service';

	// import { ListPlaceholder } from 'flowbite-svelte';
	import type { TimeEntity } from '$lib/entities/time.entity';
	import type {
		Anniversary,
		AnniversaryExample,
		AnniversaryPayload
	} from '$lib/entities/anniversary.entity';
	import MilestoneLabel from './MilestoneLabel.svelte';
	import MilestoneHero from './MilestoneHero.svelte';
	import type { DateTypeCalculator } from '$lib/content/dateTypes';
	import { ListPlaceholder } from 'flowbite-svelte';
	import NextDates from './NextDates.svelte';
	import { ApiService } from '$lib/services/api.service';
	import type { CheckoutPayload } from '$lib/payloads/checkout.payload';
	import type { CheckoutResponse } from '$lib/responses/checkout.response';
	import type { UiErrorEntity } from '$lib/entities/error.entity';
	import UiErrorMessage from './UiErrorMessage.svelte';

	let dateService: DatesService;
	let apiService: ApiService;

	// let dateReactive = $derived(new Date());
	let dateReactive = $state(new Date());

	let heroAnniversary: Anniversary | undefined = $state<Anniversary>();
	let nextAnniversaries: Anniversary[] = $state([]);
	let paid: boolean = $state(true);
	let uiError: UiErrorEntity;

	// let origin = $state(DEFAULT_ORIGIN);
	let now = $state(Date.now());

	interface Props {
		dataType: DateTypeCalculator;
	}

	let { dataType }: Props = $props();

	const findAnniversaries: () => Promise<void> = async () => {
		console.log(`findAnniversaries ${dateReactive.toISOString()}`);
		// generateDates(dateReactive);
		const generatedAnniversaries: AnniversaryPayload[] = await lib.compute_preview(
			dateReactive.toISOString()
		);
		console.log(generatedAnniversaries.length);

		//filtering out invalid/useless JS dates
		const lifetime: number = new Date().getFullYear() + 50;
		const validAnniversaries: Anniversary[] = [];

		generatedAnniversaries
			// .filter((item: Anniversary | undefined): item is Anniversary => item !== undefined);
			.forEach((a: AnniversaryPayload) => {
				if (!a) {
					return undefined;
				}

				const dateObj: Date = new Date(a.date);
				if (
					dateObj instanceof Date &&
					!isNaN(dateObj.valueOf()) &&
					dateObj.getFullYear() < lifetime
				) {
					const annif: Anniversary = {
						date: dateObj,
						unit: a.unit,
						funNumber: a.fun_number
					};
					validAnniversaries.push(annif);
				}
			});

		//anniversaries are coming back sorted, but we're changing the sort order here
		const anniversariesSorted: Anniversary[] = validAnniversaries.sort(
			(a: Anniversary, b: Anniversary) => a.date.getTime() - b.date.getTime()
		);

		heroAnniversary = anniversariesSorted[0];
		nextAnniversaries[0] = anniversariesSorted[1];
		nextAnniversaries[1] = anniversariesSorted[2];
		nextAnniversaries[2] = anniversariesSorted[3];
	};

	onMount(async () => {
		dateService = new DatesService();

		const time: TimeEntity = dateService.init_time();
		dateReactive = time.now;

		apiService = new ApiService();

		await lib.default();
		findAnniversaries();
	});

	const selectExample: (ex: AnniversaryExample) => Promise<void> = async (
		ex: AnniversaryExample
	) => {
		dateReactive = ex.date!;
		findAnniversaries();
	};

	const postPricing: (type: string) => Promise<void> = async (type: string) => {
		try {
			const payload: CheckoutPayload = {
				date: dateReactive.toISOString(),
				scope: type
			};
			console.log('posting');
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

<section
	style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:36px;align-items:center"
>
	<MilestoneLabel {dataType} {findAnniversaries} {selectExample} bind:dateReactive></MilestoneLabel>

	{#if heroAnniversary}
		<MilestoneHero {heroAnniversary} {now} {nextAnniversaries} {postPricing}></MilestoneHero>
	{:else}
		<div
			style="background:linear-gradient(160deg,#16233D,#121D33);border:1px solid #27385A;border-radius:20px;padding:28px 26px;display:flex;flex-direction:column;gap:16px;min-width:0;container-type:inline-size"
		>
			<ListPlaceholder />
		</div>
	{/if}
</section>

<section>
	{#if paid}
		<NextDates {nextAnniversaries}></NextDates>
	{/if}
</section>

{#if uiError}
	<UiErrorMessage {uiError} />
{/if}
