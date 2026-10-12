<script lang="ts">
	import { resolve } from '$app/paths';
	import { ApiService } from '$lib/services/api.service';
	import { Label, Input } from 'flowbite-svelte';
	import { EnvelopeSolid } from 'flowbite-svelte-icons';

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
	<title>Recover your license</title>
</svelte:head>

<main class="recover">
	<h1>Recover your license</h1>

	{#if status === 'sent'}
		<div class="confirmation" role="status">
			<p>
				If an order exists for <strong>{sentTo}</strong>, we've sent your license key there. It can
				take a few minutes, and it's worth checking your spam folder.
			</p>
		</div>

		<div class="actions">
			<button type="button" class="secondary" onclick={send} disabled={cooldown > 0}>
				{cooldown > 0 ? `Send again in ${cooldown}s` : 'Send again'}
			</button>
			<button type="button" class="link" onclick={useAnotherEmail}>Use a different email</button>
		</div>
	{:else}
		<p class="lead">
			Enter the email you used at checkout. If we find an order, we'll send your license key to that
			address.
		</p>

		<form {onsubmit} novalidate>
			<div class="mb-6">
				<Label for="recover-email" class="mb-2 block">Your Email</Label>
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
				>
					{#snippet left()}
						<EnvelopeSolid class="h-5 w-5 text-gray-500 dark:text-gray-400" />
					{/snippet}
				</Input>
			</div>
			<!-- <label for="recover-email">Email</label>
			<input
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
			/> -->

			{#if status === 'error'}
				<p id="recover-error" class="error" role="alert">{errorMessage}</p>
			{/if}

			<button type="submit" class="primary" disabled={!canSubmit}>
				{status === 'sending' ? 'Sending…' : 'Send my license'}
			</button>
		</form>
	{/if}

	<p class="help">
		Still stuck? The <a href={resolve('/faq', {})}>FAQ</a> covers the common cases.
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
		color: var(--color-muted, #555);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 600;
	}

	input {
		padding: 0.65rem 0.75rem;
		font: inherit;
		color: inherit;
		background: var(--color-surface, #fff);
		border: 1px solid var(--color-border, #bbb);
		border-radius: 0.4rem;
	}

	input[aria-invalid='true'] {
		border-color: var(--color-error, #b3261e);
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

	.primary {
		margin-top: 0.75rem;
		padding: 0.7rem 1rem;
		font-weight: 600;
		color: var(--color-on-accent, #fff);
		background: var(--color-accent, #1a1a1a);
		border: 1px solid transparent;
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
		padding: 1rem 1.1rem;
		margin-bottom: 1.25rem;
		border: 1px solid var(--color-border, #bbb);
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
		color: var(--color-muted, #555);
	}

	input:focus-visible,
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--color-accent, #1a1a1a);
		outline-offset: 2px;
	}
</style>
