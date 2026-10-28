<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { resolve } from '$app/paths';
</script>

<footer
	style="border-top:1px solid #1E2C48;padding:22px 0 30px;display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;font-size:14px;color:var(--muted-3)"
>
	<span>Funniversaries</span>
	<div style="display:flex;flex-wrap:wrap;gap:18px">
		<a href={resolve('/recover', {})} style="color:var(--muted)">{m.nav_recover()}</a>
		<a href={resolve('/privacy', {})} style="color:var(--muted)">{m.nav_privacy()}</a>
		<a href={resolve('/pricing', {})} style="color:var(--muted)">{m.nav_pricing()}</a>
		<a href={resolve('/faq', {})} style="color:var(--muted)">{m.nav_faq()}</a>
	</div>
</footer>
