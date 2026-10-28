<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { resolve } from '$app/paths';
	import { ApiService } from '$lib/services/api.service';
	import { Label, Input } from 'flowbite-svelte';

	const COOLDOWN_SECONDS = 30;

	const apiService = new ApiService();

	type Status = 'idle' | 'sending' | 'sent' | 'error';

	let email = $state('');
	let sentTo = $state('');
	let status = $state<Status>('idle');
	let errorMessage = $state('');
	let cooldown = $state(0);

	const emailLooksValid = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()));
	const canSubmit = $derived(emailLooksValid && status !== 'sending' && cooldown === 0);

	// i18n
	const SLOT = '\u0001';
	const around = (text: string): [string, string] => {
		const [before, after = ''] = text.split(SLOT);
		return [before, after];
	};
	const sentParts = $derived(around(m.recovery_sent({ email: SLOT })));
	const helpParts = $derived(around(m.recovery_help({ faq: SLOT })));

	// Client-side cooldown only discourages double clicks; the real limit is server-side.
	$effect(() => {
		if (cooldown <= 0) return;
		const timer = setTimeout(() => (cooldown -= 1), 1000);
		return () => clearTimeout(timer);
	});

	function fail(message: string) {
		errorMessage = message;
		status = 'error';
	}

	async function send() {
		if (!canSubmit) return;

		const address = email.trim();
		status = 'sending';
		errorMessage = '';

		try {
			await apiService.postResendAccess({ email });

			// The API answers the same way whether or not an order exists.
			sentTo = address;
			status = 'sent';
			cooldown = COOLDOWN_SECONDS;
		} catch {
			fail('Could not reach the server. Check your connection and try again.');
		}
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		send();
	}

	function useAnotherEmail() {
		status = 'idle';
		email = '';
		errorMessage = '';
	}
</script>

<svelte:head>
	<title>{m.recovery_title()}</title>
</svelte:head>

<main class="recover">
	<h1>{m.recovery_title()}</h1>

	{#if status === 'sent'}
		<div class="confirmation" role="status">
			<p>
				{sentParts[0]}<strong>{sentTo}</strong>{sentParts[1]}
			</p>
		</div>

		<div class="actions">
			<button type="button" class="secondary" onclick={send} disabled={cooldown > 0}>
				{cooldown > 0 ? m.recovery_send_again_in({ seconds: cooldown }) : m.recovery_send_again()}
			</button>
			<button type="button" class="link" onclick={useAnotherEmail}>
				{m.recovery_use_another_email()}
			</button>
		</div>
	{:else}
		<p class="lead">
			{m.recovery_lead()}
		</p>

		<form {onsubmit} novalidate>
			<div class="mb-6">
				<Label for="recover-email" class="mb-2 block">{m.recovery_email_label()}</Label>
				<Input
					id="recover-email"
					name="email"
					type="email"
					inputmode="email"
					autocomplete="email"
					autocapitalize="none"
					spellcheck="false"
					required
					bind:value={email}
					aria-invalid={status === 'error' ? 'true' : undefined}
					aria-describedby={status === 'error' ? 'recover-error' : undefined}
					class="pl-8"
					style="background-color:var(--color-gray-800);"
				></Input>
			</div>

			{#if status === 'error'}
				<p id="recover-error" class="error" role="alert">{errorMessage}</p>
			{/if}

			<button
				type="submit"
				style="margin-top:auto;font-size:15px;font-weight:600;color:inherit;background:transparent;border:1px solid var(--line);border-radius:12px;padding:13px 20px;min-height:46px;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor: pointer;"
				disabled={!canSubmit}
			>
				{status === 'sending' ? m.recovery_sending() : m.recovery_submit()}
			</button>
		</form>
	{/if}

	<p class="help">
		{helpParts[0]}<a href={resolve('/faq', {})}>{m.recovery_help_link()}</a>{helpParts[1]}
	</p>
</main>

<style>
	.recover {
		max-width: 28rem;
		margin: 0 auto;
		padding: 3rem 1.25rem;
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: 1.75rem;
		line-height: 1.2;
	}

	.lead,
	.confirmation p,
	.help {
		line-height: 1.55;
	}

	.lead {
		margin: 0 0 1.5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	button {
		font: inherit;
		cursor: pointer;
		border-radius: 0.4rem;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	.secondary {
		padding: 0.6rem 1rem;
		color: inherit;
		background: transparent;
		border: 1px solid var(--color-border, #bbb);
	}

	.link {
		padding: 0.25rem;
		color: inherit;
		text-decoration: underline;
		background: none;
		border: none;
	}

	.confirmation {
		margin-bottom: 2rem;
		border-radius: 0.4rem;
	}

	.confirmation p {
		margin: 0;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	.error {
		margin: 0;
		color: var(--color-error, #b3261e);
	}

	.help {
		margin: 2rem 0 0;
	}

	button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--color-accent, #1a1a1a);
		outline-offset: 2px;
	}
</style>
