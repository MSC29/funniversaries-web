<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { m } from '#lib/paraglide/messages.js';
	import type { AnniversaryEntity } from '#lib/entities/anniversary.entity.ts';
	import { translatorService } from '#lib/services/translator.service.ts';
	import { celebrants } from '#lib/stores/celebrants.svelte.ts';
	import { formatDate } from '#lib/utils/dates.ts';
	import { punchline } from '#lib/utils/fun.utils.ts';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { THEMES, drawShareCard, downloadCard } from './shareCard.ts';
	import MerchButton from '../merch/MerchButton.svelte';

	interface Props {
		a: AnniversaryEntity;
		/** the claimed date, YYYY-MM-DD: key for the names */
		day: string;
		/** paid cards drop the small credit line */
		paid?: boolean;
		onclose: () => void;
	}

	let { a, day, paid = false, onclose }: Props = $props();

	let dialog: HTMLDialogElement;
	let canvas: HTMLCanvasElement;

	let names = $state(untrack(() => celebrants.get(day)));
	const who = $derived(names.trim() || m.who_fallback());

	// Caption ideas: the punchline, the API label ("Page not found"), the nickname ("Four fours").
	const ideas = $derived(
		[
			punchline(a, who, translatorService.translate),
			translatorService.translate(a.funNumber.label),
			translatorService.getNickname(a.funNumber.count)
		].filter((s, i, all): s is string => !!s && !s.startsWith('fun_') && all.indexOf(s) === i)
	);
	let caption = $state('');
	let themeId = $state(THEMES[0].id);

	// "404 days" -> number "404", unit "days"; formatQuantity is locale-aware so split on the first space.
	const quantity = $derived(translatorService.formatQuantity(a.funNumber.count, a.unit));
	const number = $derived(new Intl.NumberFormat(getLocale()).format(a.funNumber.count));
	const unit = $derived(quantity.replace(number, '').trim());

	$effect(() => {
		if (!caption && ideas[0]) caption = ideas[0].slice(0, 80);
	});

	$effect(() => {
		if (!canvas) return;
		void drawShareCard(canvas, {
			pill: `${who} · ${formatDate(a.date)}`.toUpperCase(),
			number,
			unit,
			caption,
			credit: paid ? null : m.share_credit(),
			cta: m.share_find_yours(),
			theme: THEMES.find((t) => t.id === themeId)!
		});
	});

	onMount(() => dialog.showModal());

	function saveNames(value: string) {
		names = value;
		celebrants.set(day, value);
	}
</script>

<dialog
	bind:this={dialog}
	{onclose}
	class="fv-card fv-dialog fv-pop-lg m-auto w-[min(1100px,calc(100vw-2rem))] max-w-none p-0"
	aria-labelledby="share-title"
>
	<div class="flex flex-col gap-6 p-6 sm:p-8">
		<header class="flex items-center justify-between gap-4">
			<h2 id="share-title" class="fv-display m-0 text-4xl">{m.share_title()}</h2>
			<button class="fv-btn fv-icon-btn" aria-label={m.share_close()} onclick={() => dialog.close()}
				>✕</button
			>
		</header>

		<div class="grid items-start gap-8 md:grid-cols-[1fr_minmax(0,440px)]">
			<div class="flex flex-col gap-5">
				<div class="flex flex-col gap-1.5">
					<label for="share-names" class="fv-label">{m.share_names_label()}</label>
					<input
						id="share-names"
						class="fv-input"
						maxlength="32"
						value={names}
						oninput={(e) => saveNames(e.currentTarget.value)}
					/>
					<span class="fv-muted text-sm">{m.share_names_hint()}</span>
				</div>

				<div class="flex flex-col gap-1.5">
					<label for="share-caption" class="fv-label">{m.share_caption_label()}</label>
					<textarea
						id="share-caption"
						class="fv-input resize-y"
						rows="2"
						maxlength="80"
						bind:value={caption}></textarea>
					<div class="fv-muted flex justify-between text-sm">
						<span>{m.share_caption_ideas()}</span><span>{caption.length}/80</span>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each ideas as idea (idea)}
							<button class="fv-chip fv-chip--dashed" onclick={() => (caption = idea.slice(0, 80))}
								>{idea}</button
							>
						{/each}
					</div>
				</div>

				<div class="flex flex-col gap-1.5" role="group" aria-label={m.share_theme_label()}>
					<span class="fv-label">{m.share_theme_label()}</span>
					<div class="flex gap-3">
						{#each THEMES as t (t.id)}
							<button
								class="fv-swatch"
								style:--swatch={t.bg}
								aria-label={t.id}
								aria-pressed={themeId === t.id}
								onclick={() => (themeId = t.id)}
							></button>
						{/each}
					</div>
				</div>

				<div class="flex flex-wrap gap-2.5 pt-1">
					<button
						class="fv-btn fv-btn--coral fv-btn--big flex-[1_1_12rem]"
						onclick={() => downloadCard(canvas, `funniversary-${a.funNumber.count}-${a.unit}.png`)}
					>
						{m.share_download()}
					</button>
					<MerchButton {a} />
				</div>
			</div>

			<!-- live preview: the same canvas that gets exported -->
			<canvas bind:this={canvas} class="fv-card fv-pop aspect-[4/5] w-full" aria-label={caption}
			></canvas>
		</div>
	</div>
</dialog>
