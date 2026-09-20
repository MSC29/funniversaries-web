<script lang="ts">
	import { resolve } from '$app/paths';
	let { children } = $props();
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
	<nav style="display:flex;align-items:center;gap:20px;font-size:14px">{@render children?.()}</nav>
</header>
