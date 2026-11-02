<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { localizeHref } from '#lib/paraglide/runtime.js';

	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	let activeUrl = $derived(page.url.pathname);

	const languages = [
		{ locale: 'en', flag: '🇬🇧', label: 'English' },
		{ locale: 'fr', flag: '🇫🇷', label: 'Français' },
		{ locale: 'es', flag: '🇪🇸', label: 'Español' }
	] as const;
</script>

<header class="flex flex-wrap items-center justify-between gap-4 py-4">
	<a href={resolve('/')} class="flex items-center gap-2.5 no-underline">
		<span
			class="fv-display fv-card fv-card--coral fv-pop-sm flex h-10 w-10 -rotate-6 items-center justify-center rounded-xl text-xl"
			aria-hidden="true">F</span
		>
		<span class="fv-display text-xl">Funniversaries</span>
	</a>

	<nav class="flex flex-wrap items-center gap-5 text-[15px] font-semibold">
		<a href={resolve('/pricing')} class="no-underline">{m.nav_pricing()}</a>
		<a href={resolve('/faq')} class="no-underline">{m.nav_faq()}</a>
		<a href={resolve('/recover')} class="no-underline">{m.nav_recover()}</a>

		<button class="fv-chip min-h-11" aria-label={m.nav_choose_language()}>
			{m.nav_language()}
			<ChevronDownOutline class="ms-1 h-4 w-4" />
		</button>

		<Dropdown {activeUrl} simple>
			{#each languages as language (language)}
				<DropdownItem
					href={localizeHref(activeUrl, { locale: language.locale })}
					data-sveltekit-reload
				>
					<span class="me-2" aria-hidden="true">{language.flag}</span>
					<span lang={language.locale}>{language.label}</span>
				</DropdownItem>
			{/each}
		</Dropdown>
	</nav>
</header>
