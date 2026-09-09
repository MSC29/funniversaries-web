<script lang="ts">
	import type { Anniversary } from '$lib/entities/anniversary.entity';
	import { Badge, Button, Card } from 'flowbite-svelte';

	export let heroAnniversary: Anniversary;
</script>

{#if heroAnniversary}
	<Card size="lg" class="p-4 text-center sm:p-8 md:p-10">
		<h5 class="mb-2 text-7xl font-bold text-gray-900 dark:text-white">
			{heroAnniversary.funNumber.title}
			{heroAnniversary.unit}
		</h5>
		<p class="mt-1 mb-4 text-lg text-[#7c7c8b]">On {heroAnniversary.date?.toLocaleDateString()}</p>

		<p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
			{heroAnniversary.funNumber.label}
		</p>
		<p class="mt-1 mb-4 text-lg text-[#7c7c8b]">{heroAnniversary.funNumber.description}</p>
		<div
			class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse"
		>
			<Button>Buy the tee shirt</Button>
		</div>
	</Card>
{/if}
