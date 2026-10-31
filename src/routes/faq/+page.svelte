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
			kind: ''
		},
		{
			count: 9876543210,
			title: '9,876,543,210',
			label: 'Descending sequence',
			description: 'All ten digits, in perfect descending order.',
			kind: ''
		},
		{
			count: 10000,
			title: '10,000',
			label: 'Round number',
			description: 'A clean, round milestone.',
			kind: ''
		},
		{
			count: 777,
			title: '777',
			label: 'Lucky sevens',
			description: 'The classic slot-machine jackpot number.',
			kind: ''
		},
		{
			count: 451,
			title: '451',
			label: 'The temperature books burn at',
			description:
				"Fahrenheit 451 — Ray Bradbury's novel, named for the temperature at which paper is said to combust.",
			kind: ''
		},
		{
			count: 1337,
			title: '1337',
			label: 'Leet',
			description:
				'"Leet" — internet slang for "elite," popularized in early hacker and gaming culture.',
			kind: ''
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

<!--
	Markup only: paste inside your existing <main class="faq"> and keep your own <script> and <style>.
	Items in [square brackets] are decisions or facts only you can confirm. Remove the brackets once settled.
	Move the strings into your paraglide messages when you translate (fr / es).
-->
<main class="faq">
	<h1>Frequently asked questions</h1>

	<section>
		<h2>How it works</h2>

		<details>
			<summary>What is Funniversaries?</summary>
			<p>
				Funniversaries turns a date into the fun milestones that come after it: your 10,000th day,
				your 1,000th week, a perfect 123,456 hours. Enter a birthday, a relationship date, a baby’s
				birth date or a work start date, and see when each milestone lands.
			</p>
		</details>

		<details>
			<summary>What’s free and what’s paid?</summary>
			<p>
				Free: enter any date and instantly see up to 4 of its nearest milestones, with no sign-up.
				It is calculated in your browser.
			</p>
			<p>
				Paid: the full list of milestones for your date, a calendar file you can add to your
				calendar, and a reminder before each milestone. Single date ($4) unlocks one date. Any date
				($10) unlocks every date you enter. Both are one-time payments, not subscriptions.
			</p>
		</details>

		<details>
			<summary>What does unlocking a date mean?</summary>
			<p>
				Unlocking links your purchase to a date, so the full list for that date appears on this
				device and whenever you recover your purchase. [State the rule for changing the date: for
				example “A Single date stays tied to the date you claimed, so check it before you confirm.”
				or “You can change it by contacting us.”]
			</p>
		</details>

		<details>
			<summary>How do you count days?</summary>
			<p>
				Funniversaries counts from the calendar date you enter. [Confirm each point: no time of day
				is used, so the birth time does not matter; the time zone is … ; February 29 is handled as …
				; month and year milestones that fall on a day that does not exist (such as the 31st) are …]
				Results are meant for fun and personal use. If a date matters legally or medically, check it
				yourself.
			</p>
		</details>

		<details>
			<summary>How do the calendar export and reminders work?</summary>
			<p>
				Download a calendar file (.ics) and open it in Google Calendar, Apple Calendar, Outlook or
				any calendar app. Each milestone becomes an event, with a reminder alarm included in the
				file. We do not send reminder emails ourselves, and how an alarm behaves depends on your
				calendar app. Once you have the file, it is yours to keep.
			</p>
		</details>

		<!--
		TODO (print partners): leave this entry out until a print partner is live.
		<details>
			<summary>Can I print a milestone on a shirt, mug, cap or poster?</summary>
			<p>[Say how it works, who prints it, who ships it and what data is shared.]</p>
		</details>
		Also remove or soften the same promise in the pricing page footer.
		-->
	</section>

	<section>
		<h2>Payment and what you get</h2>

		<details>
			<summary>How much does it cost, and is it a subscription?</summary>
			<p>
				There is no subscription. Single date is $4, one time, for one date. Any date is $10, one
				time, for every date. Looking at your first milestones is always free.
			</p>
		</details>

		<details>
			<summary>What exactly am I paying for?</summary>
			<p>
				The full list of milestones for your date, plus calendar export with reminders. Here’s a
				sample of what’s included:
			</p>
			<ul class="sample">
				<li><b>123,456</b> <i>(Six digits in perfect ascending order.)</i></li>
				<li><b>9,876,543,210</b> <i>(All ten digits, in perfect descending order.)</i></li>
				<li><b>10,000</b> <i>(A clean, round milestone.)</i></li>
				<li><b>777</b> <i>(The classic slot-machine jackpot number.)</i></li>
				<li>
					<b>451</b>
					<i
						>(Fahrenheit 451, Ray Bradbury’s novel, named for the temperature at which paper is said
						to combust.)</i
					>
				</li>
				<li>
					<b>1337</b>
					<i
						>(“Leet”, internet slang for “elite”, popularized in early hacker and gaming culture.)</i
					>
				</li>
			</ul>
		</details>

		<details>
			<summary>Is the payment safe?</summary>
			<p>
				Payments are handled by Lemon Squeezy, which is the seller of record: it processes your
				card, takes care of taxes and sends your receipt. Your card details never reach
				Funniversaries.
			</p>
		</details>

		<details>
			<summary>Can I get a refund?</summary>
			<p>
				Refunds are processed by Lemon Squeezy. If something is wrong, write to
				<a href="mailto:1100labs@proton.me">1100labs@proton.me</a> with your order number and we
				will sort it out or ask Lemon Squeezy to refund you. If you are a consumer in the EU, your
				legal right of withdrawal is explained at checkout and in our
				<a href="/legal/sales">Terms of Sale</a>. [Add any refund guarantee you decide to offer, for
				example “within 14 days, no questions asked”.]
			</p>
		</details>

		<details>
			<summary>What happens to my email and my dates?</summary>
			<p>
				We keep your purchase email, your order and license, and the dates you claimed, so you can
				recover your purchase later. We use your email only for your purchase and for recovery
				emails. We never send marketing or newsletters, and we never sell your data. You can ask us
				to delete it at any time. Details are in the
				<a href="/legal/privacy">Privacy Policy</a>.
			</p>
		</details>
	</section>

	<section>
		<h2>If something goes wrong</h2>

		<details>
			<summary>I lost access to my purchase</summary>
			<p>
				Use the <a href="/recover">recovery page</a>. Enter the email you used at checkout and we
				will send you a verification email. Once you verify, all the dates you bought with that
				email are back. Check your spam folder if it doesn’t arrive within a few minutes.
			</p>
		</details>

		<details id="pending">
			<summary>I paid but my license is still pending</summary>
			<p>
				Activation can take a few minutes after payment. Wait a moment, then refresh the page and
				try again. If it’s still pending after 15 minutes, write to
				<a href="mailto:1100labs@proton.me">1100labs@proton.me</a> with your order number and we’ll sort
				it out.
			</p>
		</details>

		<details>
			<summary>My license failed to activate</summary>
			<p>
				First, check that you copied the whole key with no extra spaces. If it still fails, write to
				<a href="mailto:1100labs@proton.me">1100labs@proton.me</a> with your order number and the error
				you see.
			</p>
		</details>

		<details>
			<summary>It says my license is already in use or the limit is reached</summary>
			<p>
				If you changed device or cleared your browser data, try the
				<a href="/recover">recovery page</a> first. If that doesn’t solve it, write to
				<a href="mailto:1100labs@proton.me">1100labs@proton.me</a> and we’ll reset it for you.
			</p>
		</details>

		<details>
			<summary>I used the wrong email at checkout</summary>
			<p>
				Write to <a href="mailto:1100labs@proton.me">1100labs@proton.me</a> with your order number and
				the email you meant to use, and we’ll fix it.
			</p>
		</details>

		<details>
			<summary>I need a receipt or invoice</summary>
			<p>
				Lemon Squeezy emails a receipt right after your purchase. If you can’t find it, write to
				<a href="mailto:1100labs@proton.me">1100labs@proton.me</a> with your order number.
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

	<section>
		<h2>About</h2>

		<details>
			<summary>Who runs Funniversaries?</summary>
			<p>
				Funniversaries is built and run by 1100Labs, an independent one-person business based in
				France. Questions, bugs or ideas: <a href="mailto:1100labs@proton.me">1100labs@proton.me</a
				>.
			</p>
		</details>
	</section>

	<p class="contact">
		Didn’t find your answer? Write to <a href="mailto:1100labs@proton.me">1100labs@proton.me</a>
		and include your order number if you have one.
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
