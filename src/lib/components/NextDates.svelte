<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { AccordionItem, Accordion, TextPlaceholder } from 'flowbite-svelte';

	import type { AnniversariesEntity } from '#lib/entities/anniversary.entity.ts';
	import { formatDate, formatRelativeDays } from '#lib/utils/dates.ts';
	import AddToCalendar from './AddToCalendar.svelte';
	import type { CalendarEvent } from '#lib/services/calendar.service.ts';
	import { translatorService } from '#lib/services/translator.service.ts';

	interface Props {
		anniversaries: AnniversariesEntity;
		dateSelected: Date;
		calendarEvents: CalendarEvent[];
		loading: boolean;
	}

	let { anniversaries, dateSelected, calendarEvents, loading }: Props = $props();
</script>

<div class="flex items-center justify-between gap-4">
	<h2 id="preview-title">
		{#if loading}
			<TextPlaceholder />
		{:else}
			{m.preview_title({ date: formatDate(dateSelected) })}
		{/if}
	</h2>
	<AddToCalendar events={calendarEvents} />
</div>

<section class="mt-10">
	<Accordion multiple>
		{#if loading}
			<AccordionItem>
				{#snippet header()}<TextPlaceholder />{/snippet}
				<ol class="relative border-s border-gray-200 dark:border-gray-700">
					<TextPlaceholder />
				</ol>
			</AccordionItem>
		{:else}
			{#each anniversaries.buckets as bucket, i (bucket.horizon)}
				<AccordionItem open={i == 0}>
					{#snippet header()}{bucket.horizon}{/snippet}
					<ol class="relative border-s border-gray-200 dark:border-gray-700">
						{#each bucket.anniversaries as a (a.id)}
							<li class="ms-4 mb-10">
								<div
									class="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900"
								></div>
								<time
									datetime={a.date.toISOString()}
									class="text-md mb-1 leading-none font-normal text-gray-400 dark:text-gray-500"
								>
									{formatDate(a.date)} - {formatRelativeDays(a.date)}
								</time>
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
									{translatorService.formatQuantity(a.funNumber.count, a.unit)}
								</h3>
								<p class="text-base font-normal text-gray-500 dark:text-gray-400">
									{translatorService.translate(a.funNumber.description)}
								</p>
							</li>
						{/each}
					</ol>
				</AccordionItem>
			{/each}
		{/if}
	</Accordion>
</section>

<style>
	h2 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
	}
</style>
