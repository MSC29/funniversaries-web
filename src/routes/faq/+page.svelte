<script lang="ts">
	import { resolve } from '$app/paths';
	import type { FunNumberDef } from '$lib/entities/anniversary.entity';

	// Fill these in once; they're used throughout the page.
	const PRICE = '[price]'; // e.g. '€9'
	const SUPPORT_EMAIL = '[support@yourdomain]';
	const REFUND_POLICY = '[refund policy, e.g. "within 14 days, no questions asked"]';

	// Replace with a slice of FUN_NUMBERS so the sample can never drift from the app,
	// e.g. const sample = FUN_NUMBERS.slice(0, 6).map(...)
	const sample: FunNumberDef[] = [
		{
			count: 123456,
			title: '123,456',
			label: 'Ascending sequence',
			description: 'Six digits in perfect ascending order.',
			type: '',
			distance: '',
			bucket: ''
		},
		{
			count: 9876543210,
			title: '9,876,543,210',
			label: 'Descending sequence',
			description: 'All ten digits, in perfect descending order.',
			type: '',
			distance: '',
			bucket: ''
		},
		{
			count: 10000,
			title: '10,000',
			label: 'Round number',
			description: 'A clean, round milestone.',
			type: '',
			distance: '',
			bucket: ''
		},
		{
			count: 777,
			title: '777',
			label: 'Lucky sevens',
			description: 'The classic slot-machine jackpot number.',
			type: '',
			distance: '',
			bucket: ''
		},
		{
			count: 451,
			title: '451',
			label: 'The temperature books burn at',
			description:
				"Fahrenheit 451 — Ray Bradbury's novel, named for the temperature at which paper is said to combust.",
			type: '',
			distance: '',
			bucket: ''
		},
		{
			count: 1337,
			title: '1337',
			label: 'Leet',
			description:
				'"Leet" — internet slang for "elite," popularized in early hacker and gaming culture.',
			type: '',
			distance: '',
			bucket: ''
		}
	];
</script>

<svelte:head>
	<title>FAQ</title>
</svelte:head>

<main class="faq">
	<h1>Frequently asked questions</h1>

	<section>
		<h2>How it works</h2>

		<details>
			<summary>What is Funniversaries?</summary>
			<p>
				[One or two sentences: what the app does and who it's for. Say what people get in plain
				terms, not how it's built.]
			</p>
		</details>

		<details>
			<summary>How do I unlock it?</summary>
			<p>
				Buy a license from the checkout page. Once your payment goes through, you get a license key
				by email and your purchase is linked to your account automatically. If it doesn't show up
				right away, see <a href="#pending">"I paid but my license is still pending"</a> below.
			</p>
		</details>
	</section>

	<section>
		<h2>Payment and what you get</h2>

		<details>
			<summary>How much does it cost, and is it a subscription?</summary>
			<p>
				The license costs {PRICE}. [One-time payment, or recurring? State it explicitly, and say
				what's free vs. unlocked.]
			</p>
		</details>

		<details>
			<summary>What exactly am I paying for?</summary>
			<p>
				[One sentence on what the license unlocks.]
				{#if sample.length}
					Here's a sample of what's included:
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
			<summary>Is the payment safe?</summary>
			<p>
				Payments are handled by Lemon Squeezy, which processes your card and takes care of taxes and
				receipts. Your card details never reach Funniversaries.
			</p>
		</details>

		<details>
			<summary>What data do you keep?</summary>
			<p>
				We keep your purchase email and license key so you can recover your license later. [Add
				anything else you store, and a link to your privacy page.]
			</p>
		</details>

		<details>
			<summary>Can I get a refund?</summary>
			<p>
				{REFUND_POLICY} To request one, write to
				<a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> with your order number.
			</p>
		</details>
	</section>

	<section>
		<h2>If something goes wrong</h2>

		<details>
			<summary>I lost my license key</summary>
			<p>
				Use the <a href={resolve('/recover', {})}>recovery page</a>. Enter the email you used at
				checkout and we'll send your key there. Check your spam folder if it doesn't arrive within a
				few minutes.
			</p>
		</details>

		<details id="pending">
			<summary>I paid but my license is still pending</summary>
			<p>
				Activation can take a few minutes after payment. Wait a moment, then refresh the page and
				try again. If it's still pending after 15 minutes, write to
				<a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> with your order number and we'll sort it
				out.
			</p>
		</details>

		<details>
			<summary>My license failed to activate</summary>
			<p>
				First, check that you copied the whole key with no extra spaces. If it still fails, write to
				<a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> with your order number and the error you
				see.
			</p>
		</details>

		<details>
			<summary>It says my license is already in use or the limit is reached</summary>
			<p>
				A license can only be active on a limited number of devices. If you've changed device or
				cleared your browser data, write to
				<a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> and we'll reset it for you.
			</p>
		</details>

		<details>
			<summary>I used the wrong email at checkout</summary>
			<p>
				Write to <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> with your order number and the email
				you meant to use, and we'll fix it.
			</p>
		</details>

		<details>
			<summary>I need a receipt or invoice</summary>
			<p>
				Lemon Squeezy emails a receipt right after your purchase. If you can't find it, write to
				<a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> with your order number.
			</p>
		</details>

		<details>
			<summary>My payment was declined</summary>
			<p>
				Declines usually come from your bank or card issuer. Try another card or payment method, or
				contact your bank. Nothing is charged when a payment is declined.
			</p>
		</details>
	</section>

	<p class="contact">
		Didn't find your answer? Write to
		<a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> and include your order number if you have one.
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

	details {
		border-bottom: 1px solid var(--color-border, #ddd);
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
