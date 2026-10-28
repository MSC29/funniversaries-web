<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime.js';

	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	let activeUrl = $derived(page.url.pathname);

	const languages = [
		{ locale: 'en', flag: '🇬🇧', label: 'English' },
		{ locale: 'fr', flag: '🇫🇷', label: 'Français' },
		{ locale: 'es', flag: '🇪🇸', label: 'Español' }
	] as const;
</script>

<header
	style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;padding:6px 0 18px;border-bottom:1px solid #1E2C48"
>
	<a
		href={resolve('/', {})}
		style="display:flex;align-items:center;gap:10px;color:var(--ink);text-decoration:none"
	>
		<span
			style="width:26px;height:26px;border-radius:8px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--bg)"
			>F</span
		> <span style="font-size:17px;font-weight:600;letter-spacing:-0.01em">Funniversaries</span>
	</a>

	<nav style="display:flex;align-items:center;gap:20px;font-size:14px">
		<a href={resolve('/pricing', {})} style="color:var(--muted)">{m.nav_pricing()}</a>
		<a href={resolve('/faq', {})} style="color:var(--muted)">{m.nav_faq()}</a>

		<button
			style="margin-top:auto;font-size:15px;font-weight:600;color:inherit;background:transparent;border:1px solid var(--line);border-radius:12px;padding:13px 20px;min-height:46px;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor: pointer;"
			aria-label={m.nav_choose_language()}
		>
			{m.nav_language()}
			<ChevronDownOutline class="ms-2 h-5 w-5" />
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
