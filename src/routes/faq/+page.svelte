<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { resolve } from '$app/paths';
	import type { FunNumberDefResponse } from '$lib/responses/anniversary.response';
	import type { Snippet } from 'svelte';

	// Fill these in once; they're used throughout the page.
	const PRICE = '[price]'; // e.g. '€9'
	const SUPPORT_EMAIL = '[support@yourdomain]';
	const REFUND_POLICY = '[refund policy, e.g. "within 14 days, no questions asked"]';

	// Replace with a slice of FUN_NUMBERS so the sample can never drift from the app,
	// e.g. const sample = FUN_NUMBERS.slice(0, 6).map(...)
	const sample: FunNumberDefResponse[] = [
		{
			count: 123456,
			title: '123,456',
			label: 'Ascending sequence',
			description: 'Six digits in perfect ascending order.',
			type: ''
		},
		{
			count: 9876543210,
			title: '9,876,543,210',
			label: 'Descending sequence',
			description: 'All ten digits, in perfect descending order.',
			type: ''
		},
		{
			count: 10000,
			title: '10,000',
			label: 'Round number',
			description: 'A clean, round milestone.',
			type: ''
		},
		{
			count: 777,
			title: '777',
			label: 'Lucky sevens',
			description: 'The classic slot-machine jackpot number.',
			type: ''
		},
		{
			count: 451,
			title: '451',
			label: 'The temperature books burn at',
			description:
				"Fahrenheit 451 — Ray Bradbury's novel, named for the temperature at which paper is said to combust.",
			type: ''
		},
		{
			count: 1337,
			title: '1337',
			label: 'Leet',
			description:
				'"Leet" — internet slang for "elite," popularized in early hacker and gaming culture.',
			type: ''
		}
	];

	// Messages with a link inside carry a slot where it goes, so each language keeps its own word order.
	const SLOT = '\u0001';
</script>

{#snippet rich(text: string, link: Snippet)}
	{@const [before, after = ''] = text.split(SLOT)}
	{before}{@render link()}{after}
{/snippet}

{#snippet mail()}<a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a>{/snippet}
{#snippet pendingLink()}<a href="#pending">{m.faq_pending_q()}</a>{/snippet}
{#snippet recoverLink()}<a href={resolve('/recover', {})}>{m.faq_lost_link()}</a>{/snippet}

<svelte:head>
	<title>{m.faq_page_title()}</title>
</svelte:head>

<main class="faq">
	<h1>{m.faq_title()}</h1>

	<section>
		<h2>{m.faq_section_how()}</h2>

		<details>
			<summary>{m.faq_what_q()}</summary>
			<p>
				{m.faq_what_a()}
			</p>
		</details>

		<details>
			<summary>{m.faq_unlock_q()}</summary>
			<p>
				{@render rich(m.faq_unlock_a({ pending: SLOT }), pendingLink)}
			</p>
		</details>
	</section>

	<section>
		<h2>{m.faq_section_payment()}</h2>

		<details>
			<summary>{m.faq_price_q()}</summary>
			<p>
				{m.faq_price_a({ price: PRICE })}
			</p>
		</details>

		<details>
			<summary>{m.faq_included_q()}</summary>
			<p>
				{m.faq_included_a()}
				{#if sample.length}
					{m.faq_included_sample()}
				{/if}
			</p>
			{#if sample.length}
				<ul class="sample">
					{#each sample as item (item.count)}
						<li><b>{item.title}</b> <i>({item.description})</i></li>
					{/each}
				</ul>
			{/if}
		</details>

		<details>
			<summary>{m.faq_safe_q()}</summary>
			<p>
				{m.faq_safe_a()}
			</p>
		</details>

		<details>
			<summary>{m.faq_data_q()}</summary>
			<p>
				{m.faq_data_a()}
			</p>
		</details>

		<details>
			<summary>{m.faq_refund_q()}</summary>
			<p>
				{@render rich(m.faq_refund_a({ policy: REFUND_POLICY, email: SLOT }), mail)}
			</p>
		</details>
	</section>

	<section>
		<h2>{m.faq_section_trouble()}</h2>

		<details>
			<summary>{m.faq_lost_q()}</summary>
			<p>
				{@render rich(m.faq_lost_a({ recovery: SLOT }), recoverLink)}
			</p>
		</details>

		<details id="pending">
			<summary>{m.faq_pending_q()}</summary>
			<p>
				{@render rich(m.faq_pending_a({ email: SLOT }), mail)}
			</p>
		</details>

		<details>
			<summary>{m.faq_activation_q()}</summary>
			<p>
				{@render rich(m.faq_activation_a({ email: SLOT }), mail)}
			</p>
		</details>

		<details>
			<summary>{m.faq_limit_q()}</summary>
			<p>
				{@render rich(m.faq_limit_a({ email: SLOT }), mail)}
			</p>
		</details>

		<details>
			<summary>{m.faq_wrong_email_q()}</summary>
			<p>
				{@render rich(m.faq_wrong_email_a({ email: SLOT }), mail)}
			</p>
		</details>

		<details>
			<summary>{m.faq_receipt_q()}</summary>
			<p>
				{@render rich(m.faq_receipt_a({ email: SLOT }), mail)}
			</p>
		</details>

		<details>
			<summary>{m.faq_declined_q()}</summary>
			<p>
				{m.faq_declined_a()}
			</p>
		</details>
	</section>

	<p class="contact">
		{@render rich(m.faq_contact({ email: SLOT }), mail)}
	</p>
</main>

<style>
	.faq {
		max-width: 40rem;
		margin: 0 auto;
		padding: 3rem 1.25rem;
	}

	h1 {
		margin: 0 0 2rem;
		font-size: 1.75rem;
		line-height: 1.2;
	}

	h2 {
		margin: 2.5rem 0 0.75rem;
		font-size: 1.2rem;
	}

	details:first-of-type {
		border-top: 1px solid var(--color-border, #ddd);
	}

	summary {
		padding: 0.9rem 0;
		font-weight: 600;
		cursor: pointer;
	}

	details p,
	.contact {
		margin: 0 0 1rem;
		line-height: 1.6;
		color: var(--color-muted, #aebbd4);
	}

	.sample {
		margin: 0 0 1rem;
		padding-left: 1.25rem;
		line-height: 1.6;
		color: var(--color-muted, #aebbd4);
	}

	.contact {
		margin-top: 2.5rem;
	}

	summary:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--color-accent, #1a1a1a);
		outline-offset: 2px;
	}
</style>
