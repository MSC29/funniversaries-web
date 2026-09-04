<script lang="ts">
	import { Timeline, TimelineItem, Badge } from 'flowbite-svelte';

	import type { Anniversary } from '$lib/entities/anniversary.entity';

	export let nextAnniversaries: Anniversary[];

	const badgeColor = {
		'Round number': 'indigo',
		Repdigit: 'yellow',
		Palindrome: 'green',
		Sequential: 'purple',
		'Meme number': 'pink'
	};
</script>

<!-- Coming up: a real sequence, so a timeline (not a card grid) -->
<section>
	<h2 class="mb-6 text-lg font-medium text-[#7c7c8b]">Coming up</h2>
	<Timeline>
		{#each nextAnniversaries as item}
			<TimelineItem title={item.bucket} date={item.distance}>
				<div class="mt-1 flex flex-wrap items-center gap-2">
					<Badge color={badgeColor[item.type] ?? 'dark'}>{item.type}</Badge>
					<span class="text-base text-[#eeeef3]">{item.title}</span>
				</div>
				<p class="mt-1 text-sm text-[#c7c7d6]">{item.date}</p>
			</TimelineItem>
		{/each}
	</Timeline>
</section>
