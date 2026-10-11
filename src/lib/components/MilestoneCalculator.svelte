<script lang="ts">
	import { onMount } from 'svelte';
	import * as lib from '@msc29/funniversaries-wasm';
	import { page } from '$app/state';

	import { DatesService } from '$lib/services/dates.service';

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
	import Paywall from './Paywall.svelte';

	let dateService: DatesService;
	let apiService: ApiService;

	// Prerendering has no query string, so reading page.url.searchParams at this level
	// throws at build time. Start with today and apply ?date=YYYY-MM-DD in onMount (browser only).
	// Date from /claim (?date=YYYY-MM-DD), else today
	let dateReactive = $state(new Date());
	let ready = $state(false); // render date-dependent UI only when true (avoids a flash of the build-time date)

	let heroAnniversary: Anniversary | undefined = $state<Anniversary>();
	let topAnniversaries: Anniversary[] = $state([]);
	let nextAnniversaries: Anniversary[] = $state([]);

	let paid: boolean = $state(false);
	let uiError: UiErrorEntity;

	let session = $state<SessionResponse | null>(null);
	let sessionLoaded = $state(false);
	let loadError = $state(false);

	// let origin = $state(DEFAULT_ORIGIN);
	let now = $state(Date.now());

	interface Props {
		dataType: DateTypeCalculator;
	}

	let { dataType }: Props = $props();

	// Plain async function: all the awaiting lives here, outside the effect.
	const fetchData = async () => {
		console.log(`generating date from ${dateService.getDateString(dateReactive)}`);

		let generatedAnniversaries: AnniversaryPayload[];
		let entitled = false;

		if (session && session.authenticated) {
			entitled = session.entitlements.some(
				(e) =>
					e.scope === 'all-dates' ||
					(e.scope === 'single-date' && e.date === dateService.getDateString(dateReactive))
			);
		}

		if (entitled) {
			paid = true;
			generatedAnniversaries = await apiService.getAllAnniversaries(
				dateService.getDateString(dateReactive)
			);
		} else {
			generatedAnniversaries = await lib.compute_preview(dateService.getDateString(dateReactive));
			console.log(generatedAnniversaries);
		}

		return generatedAnniversaries;
	};

	// Runs after the first render, then again whenever dateReactive, session or
	// sessionLoaded change (Svelte tracks what is read synchronously inside).
	$effect(() => {
		if (!sessionLoaded) return;
		let stale = false;
		loadError = false;

		console.log(`calculator date  ${dateReactive}`);

		fetchData()
			.then((result) => {
				if (!stale) {
					console.log(result.length);

					const validAnniversaries: Anniversary[] = [];
					result
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
									funNumber: a.funNumber
								};
								validAnniversaries.push(annif);
							}
						});

					heroAnniversary = validAnniversaries[0];
					console.log(heroAnniversary);
					topAnniversaries = validAnniversaries.slice(1, 4);
					console.log(topAnniversaries);
					nextAnniversaries = validAnniversaries.slice(4);
					console.log(nextAnniversaries);
				}
			})
			.catch(() => {
				if (!stale) loadError = true;
			});

		// Cleanup: runs before the next run. Late answers for an old date are ignored.
		return () => {
			stale = true;
		};
	});

	onMount(async () => {
		await lib.default();

		dateService = new DatesService();
		apiService = new ApiService();

		session = await apiService.getSession().catch(() => null);
		sessionLoaded = true;

		const time: TimeEntity = dateService.init_time();
		dateReactive = time.now;

		if (page.url.searchParams.get('date') !== null) {
			const dateString = page.url.searchParams.get('date')!;
			dateReactive = new Date(dateString);
			console.log(`date from param  ${dateService.getDateString(dateReactive)}`);
		}
	});

	const selectExample: (ex: AnniversaryExample) => Promise<void> = async (
		ex: AnniversaryExample
	) => {
		dateReactive = ex.date!;
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
	<MilestoneLabel {dataType} {selectExample} bind:dateReactive></MilestoneLabel>

	{#if heroAnniversary}
		<MilestoneHero {heroAnniversary} {now} {topAnniversaries}></MilestoneHero>
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
	{:else}
		<Paywall {postPricing}></Paywall>
	{/if}
</section>

{#if uiError}
	<UiErrorMessage {uiError} />
{/if}
