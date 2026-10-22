<script lang="ts">
	import { Timeline, TimelineItem } from 'flowbite-svelte';
	import { AccordionItem, Accordion } from 'flowbite-svelte';

	import type { AnniversariesEntity } from '$lib/entities/anniversary.entity';
	import { formatCalendarDate } from '$lib/dates';
	import { date } from '$lib/i18n/format';

	interface Props {
		anniversaries: AnniversariesEntity;
		paid: boolean;
	}

	let { anniversaries, paid }: Props = $props();
</script>

<section class="mt-10">
	<p class="mb-10 text-center text-3xl font-medium text-[#7c7c8b]">
		{anniversaries.total} Anniversaries coming up
	</p>

	<Accordion>
		{#each anniversaries.buckets as bucket (bucket.horizon)}
			<AccordionItem>
				{#snippet header()}{bucket.horizon}{/snippet}
				<ol class="relative border-s border-gray-200 dark:border-gray-700">
					{#each bucket.anniversaries as a (a.id)}
						<li class="ms-4 mb-10">
							<div
								class="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900"
							></div>
							<time
								datetime={a.date.toISOString()}
								class="mb-1 text-sm leading-none font-normal text-gray-400 dark:text-gray-500"
							>
								{date(a.date)}
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

	{#if !paid}
		<p class="mb-10 text-center text-3xl font-medium text-[#7c7c8b]">BLUR HERE</p>
	{/if}
</section>
