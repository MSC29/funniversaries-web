<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<footer
	style="border-top:1px solid #1E2C48;padding:22px 0 30px;display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;font-size:14px;color:var(--muted-3)"
>
	<span>Funniversaries</span>
	<div style="display:flex;flex-wrap:wrap;gap:18px">
		<a href={resolve('/pricing', {})} style="color:var(--muted)">Pricing</a>
		<a href={resolve('/d/2024-02-29', {})} style="color:var(--muted)">Example date</a>
		<a href={resolve('/privacy', {})} style="color:var(--muted)">Privacy</a>
	</div>
</footer>
