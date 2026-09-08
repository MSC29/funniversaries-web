<script lang="ts">
	import type { Anniversary } from '$lib/entities/anniversary.entity';

	export let heroAnniversary: Anniversary;
</script>

{#if heroAnniversary}
	<!-- heroAnniversary: no card, just type, on the page background -->
	<section class="mb-16 text-center">
		<p class="mb-2 text-sm text-[#c7c7d6]">{heroAnniversary.date}</p>
		<p class="font-serif text-7xl leading-none tracking-tight text-[#eeeef3] sm:text-8xl">
			{heroAnniversary.funNumber.title}
		</p>
		<p class="mt-3 text-lg text-[#7c7c8b]">{heroAnniversary.funNumber.label}</p>
		<p class="mt-4 text-sm text-[#9c9ca5]">{heroAnniversary.funNumber.description}</p>
	</section>
{/if}

<style>
	.font-serif {
		font-family: 'Fraunces', ui-serif, Georgia, serif;
	}
</style>
