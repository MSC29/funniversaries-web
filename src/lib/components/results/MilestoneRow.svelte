<script lang="ts">
	import type { AnniversaryEntity } from '#lib/entities/anniversary.entity.ts';
	import { formatDate, formatRelativeDays } from '#lib/utils/dates.ts';
	import { translatorService } from '#lib/services/translator.service.ts';
	import { punchline } from '#lib/utils/fun.utils.ts';
	import { m } from '#lib/paraglide/messages.js';

	interface Props {
		a: AnniversaryEntity;
		who: string;
		onshare: (a: AnniversaryEntity) => void;
	}

	let { a, who, onshare }: Props = $props();
</script>

<li class="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4">
	<time datetime={a.date.toISOString()} class="flex w-40 flex-col">
		<span class="font-bold">{formatDate(a.date)}</span>
		<span class="fv-muted text-sm">{formatRelativeDays(a.date)}</span>
	</time>
	<span class="fv-display w-60 text-[26px]">
		{translatorService.formatQuantity(a.funNumber.count, a.unit)}
	</span>
	<p class="fv-soft m-0 min-w-0 flex-[1_1_16rem] leading-snug">
		{punchline(a, who, translatorService.translate)}
	</p>
	<span class="flex items-center gap-1.5">
		<span class="fv-pill fv-pill--outline text-xs"
			>{translatorService.getCategory(a.funNumber.kind)}</span
		>
		<button class="fv-btn fv-icon-btn" aria-label={m.action_share()} onclick={() => onshare(a)}>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"><path d="M4 12v7h16v-7M12 3v13M7 8l5-5 5 5" /></svg
			>
		</button>
	</span>
</li>
