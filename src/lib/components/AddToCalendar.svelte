<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		buildIcs,
		downloadIcs,
		todayUtc,
		type CalendarEvent,
		type ReminderMode
	} from '$lib/services/calendar.service';

	interface Props {
		/** Preview page passes preview events, full page passes the full list. */
		events: CalendarEvent[];
		filename?: string;
		calendarName?: string;
		/** Optional slot under the instructions, e.g. an upsell on the preview page. */
		footer?: Snippet;
	}

	let {
		events,
		filename = 'funniversaries.ics',
		calendarName = 'Funniversaries',
		footer
	}: Props = $props();

	const REMINDER_HOUR = 9;

	let open = $state(false);
	let reminder = $state<ReminderMode>('day-before');
	let downloaded = $state(false);
	let root = $state<HTMLElement>();
	let trigger = $state<HTMLButtonElement>();

	const upcoming = $derived(events.filter((e) => e.date.getTime() >= todayUtc().getTime()));
	const count = $derived(upcoming.length);

	function toggle() {
		open = !open;
		downloaded = false;
	}

	function close() {
		open = false;
		downloaded = false;
	}

	function download() {
		const ics = buildIcs(events, {
			calendarName,
			reminder,
			reminderHour: REMINDER_HOUR,
			fromDate: todayUtc()
		});
		downloadIcs(filename, ics);
		downloaded = true;
	}

	function onWindowClick(e: MouseEvent) {
		if (open && root && !root.contains(e.target as Node)) close();
	}

	function onWindowKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') {
			close();
			trigger?.focus();
		}
	}
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} />

<div class="cal" bind:this={root}>
	<button
		type="button"
		class="trigger"
		aria-expanded={open}
		aria-controls="cal-panel"
		bind:this={trigger}
		onclick={toggle}
	>
		Add to calendar
	</button>

	{#if open}
		<div id="cal-panel" class="panel" role="group" aria-label="Add to calendar">
			<fieldset>
				<legend>Remind me</legend>
				<label>
					<input type="radio" name="cal-reminder" value="day-before" bind:group={reminder} />
					The day before, 9:00
				</label>
				<label>
					<input type="radio" name="cal-reminder" value="same-day" bind:group={reminder} />
					On the day, 9:00
				</label>
				<label>
					<input type="radio" name="cal-reminder" value="none" bind:group={reminder} />
					No reminder
				</label>
			</fieldset>

			<button type="button" class="download" onclick={download} disabled={count === 0}>
				Download calendar file
				<span class="count">{count} {count === 1 ? 'event' : 'events'}</span>
			</button>
			<p class="status" role="status">
				{downloaded ? 'Downloaded. Open the file to add the events.' : ''}
			</p>

			<dl class="how">
				<dt>Apple Calendar, Outlook</dt>
				<dd>Open the downloaded file and pick a calendar.</dd>
				<dt>Google Calendar</dt>
				<dd>
					Import the file in
					<a
						href="https://calendar.google.com/calendar/r/settings/export"
						target="_blank"
						rel="noopener noreferrer">Settings, Import &amp; export</a
					>. Google uses your default notifications instead of the reminder above.
				</dd>
			</dl>
			<p class="tip">Tip: import into a new calendar, so you can delete every event in one step.</p>

			{@render footer?.()}
		</div>
	{/if}
</div>

<style>
	.cal {
		position: relative;
		display: inline-block;
	}

	button {
		font: inherit;
		cursor: pointer;
	}

	.trigger {
		padding: 0.55rem 1rem;
		border: 1px solid var(--cal-border, currentColor);
		border-radius: 0.5rem;
		background: var(--cal-trigger-bg, transparent);
		color: inherit;
	}

	.panel {
		position: absolute;
		z-index: 10;
		top: calc(100% + 0.5rem);
		left: 0;
		box-sizing: border-box;
		width: 22rem;
		max-width: calc(100vw - 2rem);
		padding: 1rem;
		border: 1px solid var(--cal-border, #c9c9c9);
		border-radius: 0.75rem;
		background: var(--cal-bg, #fff);
		color: var(--cal-fg, #1a1a1a);
		box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
		font-size: 0.9rem;
		line-height: 1.45;
	}

	fieldset {
		margin: 0 0 0.9rem;
		padding: 0;
		border: 0;
	}

	legend {
		padding: 0;
		margin-bottom: 0.35rem;
		font-weight: 600;
	}

	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.2rem 0;
		cursor: pointer;
	}

	.download {
		display: flex;
		width: 100%;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.65rem 0.9rem;
		border: 0;
		border-radius: 0.5rem;
		background: var(--cal-accent, #1a1a1a);
		color: var(--cal-accent-fg, #fff);
		font-weight: 600;
	}

	.download:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.count {
		font-weight: 400;
		opacity: 0.8;
	}

	.status {
		min-height: 1.3em;
		margin: 0.4rem 0 0.6rem;
		font-weight: 600;
	}

	.how {
		margin: 0;
	}

	.how dt {
		font-weight: 600;
		margin-top: 0.4rem;
	}

	.how dd {
		margin: 0;
	}

	.tip {
		margin: 0.7rem 0 0;
		opacity: 0.75;
	}

	button:focus-visible,
	input:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--cal-focus, #2563eb);
		outline-offset: 2px;
	}
</style>
