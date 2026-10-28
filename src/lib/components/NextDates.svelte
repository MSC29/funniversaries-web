<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { AccordionItem, Accordion } from 'flowbite-svelte';

	import type { AnniversariesEntity } from '$lib/entities/anniversary.entity';
	import { formatDate, formatRelativeDays } from '$lib/utils/dates';
	import AddToCalendar from './AddToCalendar.svelte';
	import type { CalendarEvent } from '$lib/services/calendar.service';

	interface Props {
		anniversaries: AnniversariesEntity;
		dateSelected: Date;
		calendarEvents: CalendarEvent[];
	}

	let { anniversaries, dateSelected, calendarEvents }: Props = $props();
</script>

<div class="flex items-center justify-between gap-4">
	<h2 id="preview-title">
		{m.preview_title({ date: formatDate(dateSelected) })}
	</h2>
	<AddToCalendar events={calendarEvents} />
</div>

<section class="mt-10">
	<Accordion multiple>
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
								{a.funNumber.title}
								{a.unit}
							</h3>
							<p class="text-base font-normal text-gray-500 dark:text-gray-400">
								{a.funNumber.description}
							</p>
						</li>
					{/each}
				</ol>
			</AccordionItem>
		{/each}
	</Accordion>
</section>

<style>
	h2 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
	}
</style>
