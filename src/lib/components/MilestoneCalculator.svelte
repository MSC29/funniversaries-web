<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { replaceState } from '$app/navigation';
	import { onMount } from 'svelte';
	import * as lib from '@msc29/funniversaries-wasm';
	import { resolve } from '$app/paths';
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
	import { ApiService } from '$lib/services/api.service';
	import type { CheckoutPayload } from '$lib/payloads/checkout.payload';
	import type { CheckoutResponse } from '$lib/responses/checkout.response';
	import type { UiErrorEntity } from '$lib/entities/error.entity';
	import UiErrorMessage from './UiErrorMessage.svelte';
	import type { SessionResponse } from '$lib/responses/session.response';
	import Paywall from './Paywall.svelte';
	import type { AnniversariesEntity, AnniversaryExample } from '$lib/entities/anniversary.entity';
	import PreviewList from './PreviewList.svelte';
	import NextDates from './NextDates.svelte';
	import { eventUid, fromLocalDate, type CalendarEvent } from '$lib/services/calendar.service';
	import { formatDate } from '$lib/utils/dates';

	let dateService: DatesService;
	let apiService: ApiService;

	// Prerendering has no query string, so reading page.url.searchParams at this level
	// throws at build time. Start with today and apply ?date=YYYY-MM-DD in onMount (browser only).
	// Date from /claim (?date=YYYY-MM-DD), else today
	let dateSelected = $state(new Date());
	let dateReady = $state(false); // true once the real date is known

	let anniversaries: AnniversariesEntity | undefined = $state();

	let paid: boolean = $state(false);
	let uiError: UiErrorEntity | undefined = $state(undefined);

	let session = $state<SessionResponse | null>(null);
	let sessionLoaded: boolean = $state(false);
	let calendarEvents: CalendarEvent[] = $state([]);

	let loading = $state(true);
	let latest = 0;

	interface Props {
		dataType: DateTypeCalculator;
	}

	let { dataType }: Props = $props();

	// Plain async function: all the awaiting lives here, outside the effect.
	const fetchData = async (): Promise<AnniversariesResponse> => {
		console.log(`generating date from ${dateService.getDateString(dateSelected)}`);

		let generatedAnniversaries: AnniversariesResponse;
		let entitled = false;

		if (session && session.authenticated) {
			entitled = session.entitlements.some(
				(e) =>
					e.scope === 'all-dates' ||
					(e.scope === 'single-date' && e.date === dateService.getDateString(dateSelected))
			);
		}

		if (entitled) {
			paid = true;
			generatedAnniversaries = await apiService.getAllAnniversaries(
				dateService.getDateString(dateSelected)
			);
		} else {
			paid = false;
			generatedAnniversaries = await lib.compute_preview(dateService.getDateString(dateSelected));
			console.log(generatedAnniversaries);
		}

		return generatedAnniversaries;
	};

	function parseDate(value: string): Date {
		console.log(`parseDate date  ${value}`);
		const d = new Date(value);
		if (Number.isNaN(d.valueOf())) throw new Error(`invalid anniversary date: ${value}`);
		return fromLocalDate(d);
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

	// Keep the address bar shareable (/fr/?d=2026-10-15) and clean when the date is today.
	$effect(() => {
		if (!dateReady) return;
		const url = new URL(location.href);
		const day = dateService.getDateString(dateSelected);
		if (day === dateService.getDateString(new Date())) url.searchParams.delete('date');
		else url.searchParams.set('date', day);
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		if (url.href !== location.href) replaceState(url, {});
	});

	// Runs after the first render, then again whenever dateReactive, session or
	// sessionLoaded change (Svelte tracks what is read synchronously inside).

	function onDateChanged(date: Date) {
		loading = true;
		const id = ++latest;
		// $effect(() => {
		// 	if (!sessionLoaded || !dateReady) return;
		let stale = false;
		uiError = undefined;

		console.log(`calculator date  ${date}`);
		console.log(`calculator date  ${dateSelected}`);

		fetchData()
			.then((response: AnniversariesResponse) => {
				console.log('fetched' + !stale);
				console.log(response);
				if (!stale) {
					anniversaries = mapToEntity(response);
					console.log('anniversaries');
					console.log(anniversaries);
					const claimed = fromLocalDate(dateSelected);
					loading = false;

					console.log('calendarEvents');
					calendarEvents = anniversaries.buckets
						.flatMap((b) => b.anniversaries)
						.map((a) => ({
							uid: eventUid(claimed, a.funNumber.count, a.unit),
							date: a.date,
							title: `${formatDate(claimed)}: ${a.funNumber.title} ${a.unit} anniversary`, // your localized title
							description: `Celebrate ${formatDate(claimed)}: ${a.funNumber.title} ${a.unit} anniversary with funniversaries.com`,
							url: `https://funniversaries.com/?d=${dateService.getDateString(a.date)}` // results page for this date
						}));
					console.log(calendarEvents);
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
			if (id === latest) loading = false;
		};
	}
	// });

	onMount(async () => {
		await lib.default();

		dateService = new DatesService();
		apiService = new ApiService();

		session = await apiService.getSession().catch(() => null);
		sessionLoaded = true;

		const time: TimeEntity = dateService.init_time();
		// The URL wins; today is only the fallback. (Reading location here is safe: no prerender.)
		dateSelected =
			dateService.parseDay(new URLSearchParams(location.search).get('date')) ?? time.now;
		dateReady = true;
		onDateChanged(dateSelected);

		if (page.url.searchParams.get('date') !== null) {
			const dateString = page.url.searchParams.get('date')!;
			dateSelected = new Date(dateString);
			console.log(`date from param  ${dateService.getDateString(dateSelected)}`);
		}
	});

	const selectExample: (ex: AnniversaryExample) => Promise<void> = async (
		ex: AnniversaryExample
	) => {
		dateSelected = ex.date!;
	};

	const postPricing: (type: string) => Promise<void> = async (type: string) => {
		try {
			const payload: CheckoutPayload = {
				date: dateService.getDateString(dateSelected),
				scope: type
			};
			console.log(`posting ${payload.scope} ${payload.date}`);
			const checkoutResponse: CheckoutResponse = await apiService.postCheckout(payload);
			window.location.assign(checkoutResponse.checkout_url); // full-page redirect to outside svelte (not using goto)
		} catch {
			uiError = {
				title: m.checkout_failed_title(),
				message: m.checkout_failed_message()
			};
		}
	};
</script>

<section
	style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:36px;align-items:center"
>
	<MilestoneLabel
		{dataType}
		{selectExample}
		bind:dateReactive={dateSelected}
		onchange={onDateChanged}
	></MilestoneLabel>
</section>

<section>
	{#if anniversaries}
		{#if paid}
			<NextDates {anniversaries} {dateSelected} {calendarEvents}></NextDates>
		{:else}
			<PreviewList {anniversaries} {paid} {dateSelected} {calendarEvents} {postPricing}
			></PreviewList>
		{/if}
	{/if}

	{#if !paid}
		<Paywall {dateSelected} {postPricing}></Paywall>
	{/if}
</section>

{#if uiError}
	<UiErrorMessage {uiError} />
{/if}
