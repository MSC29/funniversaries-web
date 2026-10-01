<script lang="ts">
	import { onMount } from 'svelte';
	import * as lib from '@msc29/funniversaries-wasm';
	import { page } from '$app/state';

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
	import type { SessionResponse } from '$lib/responses/session.response';

	let dateService: DatesService;
	let apiService: ApiService;

	// Prerendering has no query string, so reading page.url.searchParams at this level
	// throws at build time. Start with today and apply ?date=YYYY-MM-DD in onMount (browser only).
	// Date from /claim (?date=YYYY-MM-DD), else today
	let dateReactive = $state(new Date());
	let ready = $state(false); // render date-dependent UI only when true (avoids a flash of the build-time date)

	let heroAnniversary: Anniversary | undefined = $state<Anniversary>();
	let nextAnniversaries: Anniversary[] = $state([]);
	let paid: boolean = $state(true);
	let uiError: UiErrorEntity;

	let session = $state<SessionResponse | null>(null);
	let sessionLoaded = $state(false);
	let data = $state<unknown>(null);
	let loadError = $state(false);

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

	// // Does the session cover the selected day?

	// // Plain async function: all the awaiting lives here, outside the effect.
	// const fetchData = async (key: string, full: boolean) => {
	// 	if (!full) return apiService.getPreview(key);
	// 	try {
	// 		return await apiService.getAllAnniversaries(key);
	// 	} catch {
	// 		return apiService.getPreview(key); // e.g. session expired: degrade to the preview
	// 	}
	// };

	// // Runs after the first render, then again whenever dateReactive, session or
	// // sessionLoaded change (Svelte tracks what is read synchronously inside).
	// $effect(() => {
	// 	if (!sessionLoaded) return;
	// 	const key = toDateKey(dateReactive);
	// 	const full = entitled;
	// 	let stale = false;
	// 	loadError = false;

	// 	fetchData(key, full)
	// 		.then((result) => {
	// 			if (!stale) data = result;
	// 		})
	// 		.catch(() => {
	// 			if (!stale) loadError = true;
	// 		});

	// 	// Cleanup: runs before the next run. Late answers for an old date are ignored.
	// 	return () => {
	// 		stale = true;
	// 	};
	// });

	onMount(async () => {
		dateService = new DatesService();
		apiService = new ApiService();
		if (page.url.searchParams.get('date') !== null) {
			const dateString = page.url.searchParams.get('date')!;
			dateReactive = new Date(dateString);
			console.log(`date from param  ${dateService.getDateString(dateReactive)}`);
		}

		const time: TimeEntity = dateService.init_time();
		dateReactive = time.now;

		session = await apiService.getSession().catch(() => null);
		sessionLoaded = true;

		await lib.default();

		let generatedAnniversaries: AnniversaryPayload[];

		if (session && session.authenticated) {
			const entitled = session.entitlements.some(
				(e) =>
					e.scope === 'all-dates' ||
					(e.scope === 'single-date' && e.date === dateService.getDateString(dateReactive))
			);

			if (entitled) {
				generatedAnniversaries = await apiService.getAllAnniversaries(dateReactive.toISOString());
			} else {
				generatedAnniversaries = await lib.compute_preview(dateReactive.toISOString());
			}
		} else {
			generatedAnniversaries = await lib.compute_preview(dateReactive.toISOString());
		}

		const validAnniversaries: Anniversary[] = [];
		generatedAnniversaries
			// .filter((item: Anniversary | undefined): item is Anniversary => item !== undefined);
			.forEach((a: AnniversaryPayload) => {
				if (!a) {
					return undefined;
				}

				const dateObj: Date = new Date(a.date);
				if (dateObj instanceof Date && !isNaN(dateObj.valueOf())) {
					const annif: Anniversary = {
						date: dateObj,
						unit: a.unit,
						funNumber: a.fun_number
					};
					validAnniversaries.push(annif);
				}
			});

		heroAnniversary = validAnniversaries[0];
		nextAnniversaries[0] = validAnniversaries[1];
		nextAnniversaries[1] = validAnniversaries[2];
		nextAnniversaries[2] = validAnniversaries[3];

		console.log(generatedAnniversaries.length);
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
				date: dateService.getDateString(dateReactive),
				scope: type
			};
			console.log(`posting ${payload.scope} ${payload.date}`);
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
