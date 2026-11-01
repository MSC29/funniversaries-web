<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { resolve } from '$app/paths';
	import { dateTypes, type DateTypeCalculator } from '$lib/content/dateTypes';

	//default page, default DataType
	let data: DateTypeCalculator[] = dateTypes;
</script>

<footer
	style="border-top:1px solid #1E2C48;padding:22px 0 30px;display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;font-size:14px;color:var(--muted-3)"
>
	<span>Funniversaries</span>

	<nav class="footer-columns" aria-label="Footer">
		<section>
			<h2>Fun Anniversaries</h2>
			<ul>
				{#each data as d (d.slug)}
					<li>
						<a href={resolve(`/${d.slug}`, {})} style="color:var(--muted)">{d.title}</a>
					</li>
				{/each}
			</ul>
		</section>
		<section>
			<h2>Product</h2>
			<ul>
				<li><a href={resolve('/recover', {})} style="color:var(--muted)">{m.nav_recover()}</a></li>
				<li><a href={resolve('/pricing', {})} style="color:var(--muted)">{m.nav_pricing()}</a></li>
				<li><a href={resolve('/faq', {})} style="color:var(--muted)">{m.nav_faq()}</a></li>
			</ul>
		</section>
		<section>
			<h2>Legal</h2>
			<ul>
				<li>
					<a href={resolve('/legal/privacy', {})} style="color:var(--muted)">{m.nav_privacy()}</a>
				</li>
				<li>
					<a href={resolve('/legal/terms', {})} style="color:var(--muted)">{m.nav_terms()}</a>
				</li>
				<li>
					<a href={resolve('/legal/sales', {})} style="color:var(--muted)">{m.nav_sales()}</a>
				</li>
			</ul>
		</section>
	</nav>

	<p class="copyright">
		© {new Date().getFullYear()} 1100 Labs
	</p>
</footer>

<style>
	.footer-columns {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 6rem;
		max-width: 50rem;
		margin: 0 auto;
	}

	.footer-columns h2 {
		margin: 0 0 0.75rem;
		font-size: 1rem;
	}

	.footer-columns ul {
		display: grid;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.footer-columns a {
		color: inherit;
		text-decoration: none;
	}

	.footer-columns a:hover {
		text-decoration: underline;
	}

	.copyright {
		max-width: 60rem;
		/* margin: 2rem auto 0; */
		font-size: 0.875rem;
	}

	@media (max-width: 600px) {
		.footer-columns {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}
</style>
