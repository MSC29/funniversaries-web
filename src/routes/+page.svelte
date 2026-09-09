<script lang="ts">
	import { onMount } from 'svelte';
	import { Heading, P, Datepicker } from 'flowbite-svelte';
	// import { DateInput } from 'date-picker-svelte';
	// broken npm import with wasm; will try to import wasm directly import * as funniversaries from 'funniversaries';
	import * as lib from 'funniversaries-lib';

	import { DatesService } from '$lib/services/dates.service';

	import type { TimeEntity } from '$lib/entities/time.entity';
	import type { Anniversary, AnniversaryPayload } from '$lib/entities/anniversary.entity';
	import Hero from '$lib/components/Hero.svelte';
	import NextDate from '$lib/components/NextDate.svelte';

	let dateService: DatesService;

	$: dateReactive = new Date();

	let heroAnniversary: Anniversary;
	$: heroAnniversary = heroAnniversary;
	let nextAnniversaries: Anniversary[] = [];
	$: nextAnniversaries = nextAnniversaries;

	const findAnniversaries: () => Promise<void> = async () => {
		console.log(`findAnniversaries ${dateReactive.toISOString()}`);
		// generateDates(dateReactive);
		const generatedAnniversaries: AnniversaryPayload[] = await lib.generate_future_anniversaries(
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

		await lib.default();
	});
</script>

<div class="mt-5 mb-8 text-center">
	<Heading tag="h1" class="mb-4 text-5xl font-extrabold  md:text-5xl lg:text-6xl" color="white"
		>Celebrate an Anniversary</Heading
	>
	<P class="text-center text-lg sm:px-16 lg:text-xl xl:px-48" color="white"
		>Pick a date and discover the anniversaries worth celebrating!</P
	>
</div>

<div class="flex items-center justify-center">
	<div class="relative max-w-sm md:w-1/2">
		<Datepicker
			id="date-picker"
			bind:value={dateReactive}
			onselect={findAnniversaries}
			dateFormat={{ year: 'numeric', month: 'short', day: '2-digit' }}
			placeholder="Type a date or use calendar"
			autohide={true}
			required
		/>
	</div>
</div>

{#if heroAnniversary}
	<div class="mt-16 flex items-center justify-center">
		<div class="relative">
			<Hero {heroAnniversary}></Hero>
			<NextDate {nextAnniversaries}></NextDate>
		</div>
	</div>

	<!-- Paid upsell — a link, never a blocking gate -->
	<div class="mt-10 text-center">
		<button
			class="text-sm text-[#6D28D9] underline underline-offset-4 transition hover:text-[#5B21B6]"
		>
			See every milestone this century →
		</button>
	</div>
{/if}
