<script lang="ts">
	import { Timeline, TimelineItem, Badge } from 'flowbite-svelte';

	import type { Anniversary } from '$lib/entities/anniversary.entity';

	export let nextAnniversaries: Anniversary[];
</script>

<section class="mt-10">
	<p class="mb-10 text-center text-3xl font-medium text-[#7c7c8b]">Anniversaries coming up</p>

	<Timeline>
		{#each nextAnniversaries as item}
			<TimelineItem
				title="{item.funNumber.title} {item.unit}"
				date={item.date}
				dateFormat="full-date"
			>
				<p class="text-sm text-[#c7c7d6]">{item.funNumber.label}</p>
				<p class="mt-4 text-base font-normal text-gray-500 dark:text-gray-400">
					{item.funNumber.description}
				</p>
			</TimelineItem>
		{/each}
	</Timeline>
</section>
