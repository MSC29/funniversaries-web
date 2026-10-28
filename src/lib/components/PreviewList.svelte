<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';

	import type { AnniversariesEntity } from '$lib/entities/anniversary.entity';
	import { formatDate, formatRelativeDays } from '$lib/utils/dates';

	interface Props {
		anniversaries: AnniversariesEntity;
		paid: boolean;
		dateSelected: Date;
		postPricing: (type: string) => Promise<void>;
	}

	let { anniversaries, paid, dateSelected, postPricing }: Props = $props();
</script>

<section class="preview" aria-labelledby="preview-title">
	<h2 id="preview-title">{m.preview_title({ date: formatDate(dateSelected) })}</h2>

	<ol class="timeline">
		{#each anniversaries.buckets as bucket, i (bucket.horizon)}
			<li>
				<time datetime={bucket.anniversaries[0].date.toISOString()}>
					<span class="rel">{formatRelativeDays(bucket.anniversaries[0].date)}</span>
					<span class="date">{formatDate(bucket.anniversaries[0].date)}</span>
				</time>
				<div class="body">
					<p class="what">
						{bucket.anniversaries[0].funNumber.title}
						{bucket.anniversaries[0].unit}
					</p>
					<p class="why">{bucket.anniversaries[0].funNumber.description}</p>
				</div>
				<span class="window">{bucket.horizon}</span>
			</li>
		{/each}
	</ol>

	{#if !paid && anniversaries.total - anniversaries.buckets.length > 0}
		<a class="lock" href={resolve('/pricing', {})}>
			<span aria-hidden="true">🔒</span>
			<span class="lock-text"
				>{m.lock_more({ max: anniversaries.total - anniversaries.buckets.length })}</span
			>
			<strong>{m.lock_cta()}</strong>
		</a>
	{/if}
</section>

<style>
	.preview {
		display: grid;
		gap: 1rem;
	}
	h2 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
	}
	.timeline {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid var(--border, #2a3750);
		border-radius: 0.75rem;
		background: var(--surface, #1a2233);
	}
	li {
		display: grid;
		grid-template-columns: 10rem 1fr auto;
		gap: 0.25rem 1.25rem;
		align-items: baseline;
		padding: 1rem 1.25rem;
	}
	li + li {
		border-top: 1px solid var(--border, #2a3750);
	}
	time {
		grid-column: 1;
		grid-row: 1;
		display: grid;
	}
	.body {
		grid-column: 2;
		grid-row: 1;
	}
	.window {
		grid-column: 3;
		grid-row: 1;
	}
	.rel {
		font-weight: 600;
	}
	.date,
	.window,
	.why {
		color: var(--muted, #8b97ad);
		font-size: 0.875rem;
	}
	.what {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}
	.why {
		margin: 0.125rem 0 0;
	}
	.lock {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1rem;
		padding: 0.875rem 1.25rem;
		border: 1px dashed var(--border, #2a3750);
		border-radius: 0.75rem;
		color: inherit;
		text-decoration: none;
	}
	.lock-text {
		flex: 1 1 18rem;
		color: var(--muted, #8b97ad);
	}
	.lock strong {
		color: var(--accent, #ff5a2c);
	}
	.lock:hover strong {
		text-decoration: underline;
	}
	.lock:focus-visible {
		outline: 2px solid var(--accent, #ff5a2c);
		outline-offset: 2px;
	}
	@media (max-width: 40rem) {
		li {
			grid-template-columns: 1fr auto;
		}
		.body {
			grid-column: 1 / -1;
			grid-row: 2;
		}
		.window {
			grid-column: 2;
		}
	}
</style>
