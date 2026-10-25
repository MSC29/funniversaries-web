<script lang="ts">
	import { AccordionItem, Accordion } from 'flowbite-svelte';

	import type { AnniversariesEntity } from '$lib/entities/anniversary.entity';
	import { date } from '$lib/i18n/format';
	import { formatRelativeDays } from '$lib/dates';

	interface Props {
		anniversaries: AnniversariesEntity;
		paid: boolean;
		postPricing: (type: string) => Promise<void>;
	}

	let { anniversaries, paid, postPricing }: Props = $props();

	const postPricingSingleDate: () => Promise<void> = async () => {
		await postPricing('single-date');
	};
	const postPricingAllDates: () => Promise<void> = async () => {
		await postPricing('all-dates');
	};
</script>

<section class="mt-10">
	<Accordion multiple>
		{#each anniversaries.buckets as bucket, i (bucket.horizon)}
			<AccordionItem open={i == 0 || (i != 0 && !paid)}>
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
								{date(a.date)} - {formatRelativeDays(a.date)}
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
				{#if !paid && bucket.total - 1 > 0}
					<p class="text mb-10 text-center font-medium text-gray-400">
						🔒 More in this window <button
							onclick={postPricingSingleDate}
							style="font-size:15px;font-weight:600;color:inherit;background:transparent;border:1px solid var(--accent);border-radius:12px;padding:13px 20px;min-height:46px;align-items:center;justify-content:center;text-decoration:none;cursor: pointer;"
							>Unlock this date</button
						>
					</p>
				{/if}
			</AccordionItem>
		{/each}

		{#if !paid}
			<AccordionItem open={false}>
				{#snippet header()}🔒 Next 5 years{/snippet}
				<p class="text mb-10 text-center font-medium text-gray-400">
					🔒 More in this window <button
						onclick={postPricingSingleDate}
						style="font-size:15px;font-weight:600;color:inherit;background:transparent;border:1px solid var(--accent);border-radius:12px;padding:13px 20px;min-height:46px;align-items:center;justify-content:center;text-decoration:none;cursor: pointer;"
						>Unlock this date</button
					>
				</p>
			</AccordionItem>
			<AccordionItem open={false}>
				{#snippet header()}🔒 Beyond{/snippet}
				<p class="text mb-10 text-center font-medium text-gray-400">
					🔒 More in this window <button
						onclick={postPricingSingleDate}
						style="font-size:15px;font-weight:600;color:inherit;background:transparent;border:1px solid var(--accent);border-radius:12px;padding:13px 20px;min-height:46px;align-items:center;justify-content:center;text-decoration:none;cursor: pointer;"
						>Unlock this date</button
					>
				</p>
			</AccordionItem>
		{/if}
	</Accordion>
</section>
