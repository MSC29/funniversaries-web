<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { resolve } from '$app/paths';
	import { dateTypes, type DateTypeCalculator } from '#lib/content/dateTypes.ts';

	//default page, default DataType
	let data: DateTypeCalculator[] = dateTypes;
</script>

<footer class="fv-divider mt-16 flex flex-wrap justify-between gap-4 pt-6 pb-10 text-sm">
	<span class="fv-display text-lg">Funniversaries</span>

	<nav class="footer-columns" aria-label="Footer">
		<section>
			<h2>Fun Anniversaries</h2>
			<ul>
				{#each data as d (d.slug)}
					{#if d.slug}
						<li>
							<a href={resolve(d.slug)}>{d.title}</a>
						</li>
					{/if}
				{/each}
			</ul>
		</section>
		<section>
			<h2>Product</h2>
			<ul>
				<li><a href={resolve('/recover')}>{m.nav_recover()}</a></li>
				<li><a href={resolve('/pricing')}>{m.nav_pricing()}</a></li>
				<li><a href={resolve('/faq')}>{m.nav_faq()}</a></li>
			</ul>
		</section>
		<section>
			<h2>Legal</h2>
			<ul>
				<li>
					<a href={resolve('/legal/[document]', { document: 'privacy' })}>{m.nav_privacy()}</a>
				</li>
				<li>
					<a href={resolve('/legal/[document]', { document: 'terms' })}>{m.nav_terms()}</a>
				</li>
				<li>
					<a href={resolve('/legal/[document]', { document: 'sales' })}>{m.nav_sales()}</a>
				</li>
			</ul>
		</section>
	</nav>

	<p class="copyright">
		© {new Date().getFullYear()} 1100Labs
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
		font-family: var(--font-display);
		font-weight: 800;
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
