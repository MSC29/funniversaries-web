<script lang="ts">
	import type { AnniversaryEntity } from '#lib/entities/anniversary.entity.ts';
	import { formatDate, formatRelativeDays } from '#lib/utils/dates.ts';
	import { translatorService } from '#lib/services/translator.service.ts';
	import { punchline } from '#lib/utils/fun.utils.ts';
	import { m } from '#lib/paraglide/messages.js';
	import type { Snippet } from 'svelte';

	interface Props {
		a: AnniversaryEntity;
		who: string;
		/** "Next up" or "Headliner" */
		label: string;
		/** the top-of-page card is bigger */
		hero?: boolean;
		onshare: (a: AnniversaryEntity) => void;
		/** extra actions, e.g. the merch button */
		actions?: Snippet;
	}

	let { a, who, label, hero = false, onshare, actions }: Props = $props();
</script>

<article
	class="fv-card fv-card--coral {hero
		? 'fv-card--hero fv-pop-lg p-8 sm:p-9'
		: 'fv-pop p-7'} flex flex-wrap items-center gap-6"
>
	<div class="flex min-w-0 flex-[1_1_26rem] flex-col gap-3">
		<span class="fv-pill self-start">
			{label} · <time datetime={a.date.toISOString()}>{formatDate(a.date)}</time> · {formatRelativeDays(
				a.date
			)}
		</span>
		<h3 class="fv-display m-0 {hero ? 'text-[clamp(4rem,9vw,7rem)]' : 'text-6xl'}">
			{translatorService.formatQuantity(a.funNumber.count, a.unit)}
		</h3>
		<p class="m-0 max-w-[36ch] text-xl leading-snug font-medium">
			{punchline(a, who, translatorService.translate)}
		</p>
	</div>
	<div class="flex flex-[0_1_16rem] flex-col gap-2.5">
		<button class="fv-btn fv-btn--ink" onclick={() => onshare(a)}>{m.action_make_card()}</button>
		{@render actions?.()}
	</div>
</article>
