<script lang="ts">
	import { Datepicker } from 'flowbite-svelte';
	import { resolve } from '$app/paths';
	import type { AnniversaryExample } from '#lib/entities/anniversary.entity.ts';
	import { dateTypes, type DateTypeCalculator } from '#lib/content/dateTypes.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { DatesService } from '#lib/services/dates.service.ts';
	import { celebrants } from '#lib/stores/celebrants.svelte.ts';
	import CategoryIcon from './CategoryIcon.svelte';

	interface Props {
		dataType: DateTypeCalculator;
		dateReactive: Date | undefined;
		onchange?: (date: Date) => void;
	}

	let {
		dataType,
		dateReactive = $bindable<Date | undefined>(undefined),
		onchange
	}: Props = $props();

	const dates = new DatesService();
	const day = $derived(dateReactive ? dates.getDateString(dateReactive) : '');

	// "Something else" (the default page) goes last in the grid.
	const tiles = [...dateTypes.filter((d) => d.slug !== 'default'), dateTypes[0]];

	/** Tiles are the existing SEO pages; the picked date travels with them. */
	function tileHref(d: DateTypeCalculator): string {
		const path = d.slug === 'default' ? resolve('/') : resolve('/[slug]', { slug: d.slug! });
		return day ? `${path}?date=${day}` : path;
	}

	function monthsAgo(months: number): Date {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const date = new Date();
		const dayOfMonth = date.getDate();

		date.setDate(1);
		date.setMonth(date.getMonth() - months);

		const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

		date.setDate(Math.min(dayOfMonth, lastDay));
		return date;
	}

	function pick(d: Date) {
		dateReactive = d;
		onchange?.(d);
	}

	const examples: AnniversaryExample[] = [
		{ id: 1, title: m.hero_label_milestone_example_1(), date: monthsAgo(2) },
		{ id: 2, title: m.hero_label_milestone_example_2(), date: monthsAgo(6) },
		{ id: 3, title: m.hero_label_milestone_example_3(), date: monthsAgo(12) }
	];

	const stack = [
		{
			cls: 'fv-card--sun -rotate-3',
			who: m.hero_example_1_who(),
			what: m.hero_example_1_what(),
			line: m.hero_example_1_line()
		},
		{
			cls: 'rotate-3 sm:ms-auto',
			who: m.hero_example_2_who(),
			what: m.hero_example_2_what(),
			line: m.hero_example_2_line()
		},
		{
			cls: 'fv-card--ink -rotate-1 sm:ms-8',
			who: m.hero_example_3_who(),
			what: m.hero_example_3_what(),
			line: m.hero_example_3_line()
		}
	];
</script>

<section class="grid items-center gap-12 py-8 lg:grid-cols-[1.1fr_0.9fr]">
	<!-- left: pitch + the form card -->
	<div class="flex min-w-0 flex-col gap-6">
		<span class="fv-pill fv-pill--sun -rotate-2 self-start normal-case">{m.hero_eyebrow()}</span>
		<h1 class="fv-display m-0 text-[clamp(2.75rem,6vw,4.75rem)] text-balance">{dataType.h1}</h1>
		<p class="fv-soft m-0 max-w-[36ch] text-xl leading-relaxed">{dataType.subtitle}</p>

		<div class="fv-card fv-pop flex flex-col gap-5 p-6">
			<h2 class="fv-display m-0 flex items-baseline gap-2.5 text-[22px]">
				<span class="fv-pill text-[15px]">1</span>{m.hero_step_what()}
			</h2>
			<nav class="grid grid-cols-3 gap-2.5" aria-label={m.hero_step_what()}>
				{#each tiles as t (t.slug)}
					<!-- eslint-disable svelte/no-navigation-without-resolve -- tileHref() resolves -->
					<a
						class="fv-tile"
						href={tileHref(t)}
						aria-current={t.slug === dataType.slug ? 'page' : undefined}
					>
						<CategoryIcon name={t.icon} />
						<span>{t.tile}</span>
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{/each}
			</nav>

			<h2 class="fv-display m-0 mt-1 flex items-baseline gap-2.5 text-[22px]">
				<span class="fv-pill text-[15px]">2</span>{dataType.defaultLabel}
			</h2>
			<div class="grid gap-3 sm:grid-cols-2">
				<div class="flex flex-col gap-1.5">
					<label for="date-picker" class="fv-label">{dataType.label}</label>
					<Datepicker
						inputProps={{ id: 'date-picker', class: 'fv-input' }}
						bind:value={dateReactive}
						onselect={(d) => pick(d as Date)}
						dateFormat={{ year: 'numeric', month: 'short', day: '2-digit' }}
						placeholder={dataType.label}
						autohide={true}
						required
					/>
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="who" class="fv-label">{m.hero_who_label()}</label>
					<input
						id="who"
						class="fv-input"
						type="text"
						maxlength={32}
						autocomplete="off"
						placeholder={dataType.whoPlaceholder}
						disabled={!day}
						bind:value={() => celebrants.get(day), (v) => celebrants.set(day, v)}
						oninput={(e) => celebrants.set(day, e.currentTarget.value)}
					/>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-2 text-sm">
				<span class="fv-muted font-semibold">{m.hero_try()}</span>
				{#each examples as ex (ex.id)}
					<button class="fv-chip fv-chip--dashed" onclick={() => pick(ex.date)}>{ex.title}</button>
				{/each}
			</div>
			<p class="fv-muted m-0 text-center text-sm">{m.hero_free_note()}</p>
		</div>
	</div>

	<!-- right: examples, so the fun shows before anyone types (decorative) -->
	<div class="relative hidden flex-col sm:flex" aria-hidden="true">
		<span
			class="fv-display fv-card fv-card--coral absolute -top-4 right-6 z-10 flex h-24 w-24 rotate-12 items-center justify-center rounded-full text-center text-[15px] leading-tight"
			>{m.hero_example_sticker()}</span
		>
		{#each stack as card, i (i)}
			<div
				class="fv-card fv-pop {card.cls} -mt-6 flex w-[min(380px,90%)] flex-col gap-2 p-6 first:mt-0"
			>
				<span class="fv-eyebrow">{card.who}</span>
				<span class="fv-display text-[44px]">{card.what}</span>
				<span class="text-base leading-snug">{card.line}</span>
			</div>
		{/each}
	</div>
</section>
