<script lang="ts">
	import { onMount } from 'svelte';
	import * as lib from '@msc29/funniversaries-wasm';
	import { page } from '$app/state';

	import { DatesService } from '$lib/services/dates.service';

	import type { TimeEntity } from '$lib/entities/time.entity';
	import type {
		AnniversariesBucketResponse,
		AnniversariesResponse,
		AnniversaryBucketResponse
	} from '$lib/responses/anniversary.response';
	import MilestoneLabel from './MilestoneLabel.svelte';
	import type { DateTypeCalculator } from '$lib/content/dateTypes';
	// import NextDates from './NextDates.svelte';
	import { ApiService } from '$lib/services/api.service';
	import type { CheckoutPayload } from '$lib/payloads/checkout.payload';
	import type { CheckoutResponse } from '$lib/responses/checkout.response';
	import type { UiErrorEntity } from '$lib/entities/error.entity';
	import UiErrorMessage from './UiErrorMessage.svelte';
	import type { SessionResponse } from '$lib/responses/session.response';
	import Paywall from './Paywall.svelte';
	import type { AnniversariesEntity, AnniversaryExample } from '$lib/entities/anniversary.entity';
	import Paywallcard from './Paywallcard.svelte';
	import PreviewList from './PreviewList.svelte';

	let dateService: DatesService;
	let apiService: ApiService;

	// Prerendering has no query string, so reading page.url.searchParams at this level
	// throws at build time. Start with today and apply ?date=YYYY-MM-DD in onMount (browser only).
	// Date from /claim (?date=YYYY-MM-DD), else today
	let dateReactive = $state(new Date());

	let anniversaries: AnniversariesEntity | undefined = $state();

	let paid: boolean = $state(false);
	let uiError: UiErrorEntity | undefined = $state(undefined);

	let session = $state<SessionResponse | null>(null);
	let sessionLoaded = $state(false);

	interface Props {
		dataType: DateTypeCalculator;
	}

	let { dataType }: Props = $props();

	// Plain async function: all the awaiting lives here, outside the effect.
	const fetchData = async (): Promise<AnniversariesResponse> => {
		console.log(`generating date from ${dateService.getDateString(dateReactive)}`);

		let generatedAnniversaries: AnniversariesResponse;
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
			paid = false;
			generatedAnniversaries = await lib.compute_preview(dateService.getDateString(dateReactive));
			console.log(generatedAnniversaries);
		}

		return generatedAnniversaries;
	};

	function parseDate(value: string): Date {
		console.log(`parseDate date  ${value}`);
		const d = new Date(value);
		if (Number.isNaN(d.valueOf())) throw new Error(`invalid anniversary date: ${value}`);
		return d;
	}

	function mapToEntity(r: AnniversariesResponse): AnniversariesEntity {
		return {
			total: r.total,
			buckets: r.buckets.map((b: AnniversariesBucketResponse) => ({
				...b,
				anniversaries: b.anniversaries.map((a: AnniversaryBucketResponse) => ({
					id: a.id,
					unit: a.anniversary.unit,
					funNumber: a.anniversary.funNumber,
					date: parseDate(a.anniversary.date)
				}))
			}))
		};
	}

	// Runs after the first render, then again whenever dateReactive, session or
	// sessionLoaded change (Svelte tracks what is read synchronously inside).
	$effect(() => {
		if (!sessionLoaded) return;
		let stale = false;
		uiError = undefined;

		console.log(`calculator date  ${dateReactive}`);

		fetchData()
			.then((response: AnniversariesResponse) => {
				console.log('fetched');
				console.log(response);
				if (!stale) {
					anniversaries = mapToEntity(response);
					console.log(anniversaries);
					console.log(anniversaries.buckets[0].anniversaries[0].date instanceof Date);
				}
			})
			.catch((e) => {
				if (!stale) {
					uiError = {
						title: 'error fetching',
						message: e
					};
				}
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

	<!-- {#if heroAnniversary}
		<MilestoneHero {heroAnniversary} {topAnniversaries} {numberAnniversariesGenerated}
		></MilestoneHero>
	{:else}
		<div
			style="background:linear-gradient(160deg,#16233D,#121D33);border:1px solid #27385A;border-radius:20px;padding:28px 26px;display:flex;flex-direction:column;gap:16px;min-width:0;container-type:inline-size"
		>
			<ListPlaceholder />
		</div>
	{/if} -->
</section>

<section>
	{#if anniversaries}
		<!-- <NextDates {anniversaries} {paid} {postPricing}></NextDates> -->
		<PreviewList {anniversaries} {paid} {postPricing}></PreviewList>
	{/if}

	{#if !paid}
		<Paywall {postPricing}></Paywall>
		<Paywallcard></Paywallcard>
	{/if}
</section>

{#if uiError}
	<UiErrorMessage {uiError} />
{/if}
