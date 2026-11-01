<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import * as lib from '@msc29/funniversaries-wasm';
	import { page } from '$app/state';

	import { DatesService } from '#lib/services/dates.service.ts';
	import { translatorService } from '#lib/services/translator.service.ts';

	import type {
		AnniversariesBucketResponse,
		AnniversariesResponse,
		AnniversaryBucketResponse
	} from '#lib/responses/anniversary.response.ts';
	import MilestoneLabel from './MilestoneLabel.svelte';
	import type { DateTypeCalculator } from '#lib/content/dateTypes.ts';
	import { ApiService } from '#lib/services/api.service.ts';
	import type { CheckoutPayload } from '#lib/payloads/checkout.payload.ts';
	import type { CheckoutResponse } from '#lib/responses/checkout.response.ts';
	import type { UiErrorEntity } from '#lib/entities/error.entity.ts';
	import UiErrorMessage from './UiErrorMessage.svelte';
	import type { SessionResponse } from '#lib/responses/session.response.ts';
	import Paywall from './Paywall.svelte';
	import type { AnniversariesEntity } from '#lib/entities/anniversary.entity.ts';
	import PreviewList from './PreviewList.svelte';
	import NextDates from './NextDates.svelte';
	import { eventUid, fromLocalDate, type CalendarEvent } from '#lib/services/calendar.service.ts';
	import { formatDate } from '#lib/utils/dates.ts';

	let dateService: DatesService;
	let apiService: ApiService;

	// Prerendering has no query string, so reading page.url.searchParams at this level
	// throws at build time. Start with today and apply ?date=YYYY-MM-DD in onMount (browser only).
	// Date from /claim (?date=YYYY-MM-DD), else today
	let dateSelected: Date | undefined = $state(undefined);
	let dateReady = $state(false); // true once the real date is known

	let anniversaries: AnniversariesEntity | undefined = $state();

	let paid: boolean = $state(false);
	let uiError: UiErrorEntity | undefined = $state(undefined);

	let session = $state<SessionResponse | null>(null);
	let calendarEvents: CalendarEvent[] = $state([]);

	let loading = $state(true);
	let latest = 0;

	interface Props {
		dataType: DateTypeCalculator;
	}

	let { dataType }: Props = $props();

	// Plain async function: all the awaiting lives here, outside the effect.
	const fetchData = async (): Promise<AnniversariesResponse> => {
		if (!dateSelected) {
			uiError = {
				title: m.checkout_failed_title(),
				message: m.checkout_failed_message()
			};
			throw uiError;
		}

		let generatedAnniversaries: AnniversariesResponse;
		let entitled = false;

		if (session && session.authenticated) {
			entitled = session.entitlements.some(
				(e) =>
					e.scope === 'all-dates' ||
					(e.scope === 'single-date' && e.date === dateService.getDateString(dateSelected!))
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
		}

		return generatedAnniversaries;
	};

	function parseDate(value: string): Date {
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
		if (!dateReady || !dateSelected) return;

		const url = new URL(location.href);
		const day = dateService.getDateString(dateSelected);
		if (day === dateService.getDateString(new Date())) url.searchParams.delete('date');
		else url.searchParams.set('date', day);

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		if (url.href !== location.href) goto(url, { shallow: true, replace: true });
	});

	// Runs after the first render, then again whenever dateReactive, session or
	// sessionLoaded change (Svelte tracks what is read synchronously inside).

	function onDateChanged() {
		if (!dateSelected) {
			uiError = {
				title: m.checkout_failed_title(),
				message: m.checkout_failed_message()
			};
			throw uiError;
		}

		loading = true;
		const id = ++latest;
		// $effect(() => {
		// 	if (!sessionLoaded || !dateReady) return;
		let stale = false;
		uiError = undefined;

		fetchData()
			.then((response: AnniversariesResponse) => {
				if (!stale) {
					anniversaries = mapToEntity(response);

					const claimed = fromLocalDate(dateSelected!);
					loading = false;

					calendarEvents = anniversaries.buckets
						.flatMap((b) => b.anniversaries)
						.map((a) => ({
							uid: eventUid(claimed, a.funNumber.count, a.unit),
							date: a.date,
							title: `${formatDate(claimed)}: ${translatorService.formatQuantity(a.funNumber.count, a.unit)} anniversary`, // your localized title
							description: `Celebrate ${formatDate(claimed)}: ${translatorService.formatQuantity(a.funNumber.count, a.unit)} anniversary with funniversaries.com`,
							url: `https://funniversaries.com/?d=${dateService.getDateString(a.date)}` // results page for this date
						}));
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

		// The URL wins; today is only the fallback. (Reading location here is safe: no prerender.)
		dateSelected =
			dateService.parseDay(new URLSearchParams(location.search).get('date')) ?? undefined;

		if (dateSelected) {
			dateReady = true;
			onDateChanged();
		}

		if (page.url.searchParams.get('date') !== null) {
			const dateString = page.url.searchParams.get('date')!;
			dateSelected = new Date(dateString);
		}
	});

	const postPricing: (type: string) => Promise<void> = async (type: string) => {
		try {
			if (!dateSelected) {
				throw new Error();
			}

			const payload: CheckoutPayload = {
				date: dateService.getDateString(dateSelected),
				scope: type
			};

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
	<MilestoneLabel {dataType} bind:dateReactive={dateSelected} onchange={onDateChanged} />
</section>

<section>
	{#if anniversaries && dateSelected}
		{#if paid || loading}
			<NextDates {anniversaries} {dateSelected} {calendarEvents} {loading} />
		{:else}
			<PreviewList {anniversaries} {paid} {dateSelected} {calendarEvents} />
		{/if}
	{/if}

	{#if !paid && dateSelected}
		<Paywall {dateSelected} {postPricing} />
	{/if}
</section>

{#if uiError}
	<UiErrorMessage {uiError} />
{/if}
