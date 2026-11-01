<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { translatorService } from '#lib/services/translator.service.ts';

	let { data } = $props();

	// Replace with a slice of FUN_NUMBERS so the sample can never drift from the app,
	// e.g. const sample = FUN_NUMBERS.slice(0, 6).map(...)
	const sample: { count: number; unit: string }[] = [
		{
			count: 1234567890,
			unit: 'milliseconds'
		},
		{
			count: 987654321,
			unit: 'seconds'
		},
		{
			count: 10000,
			unit: 'hours'
		},
		{
			count: 777,
			unit: 'weeks'
		},
		{
			count: 451,
			unit: 'months'
		},
		{
			count: 42,
			unit: 'years'
		}
	];

	function escapeHtml(value: string) {
		return value.replace(
			/[&<>"']/g,
			(char) =>
				({
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					'"': '&quot;',
					"'": '&#39;'
				})[char]!
		);
	}

	const sampleList = `${sample.map((s) => `<li>${escapeHtml(translatorService.formatQuantity(s.count, s.unit))}</li>`).join('')}`;
	// svelte-ignore state_referenced_locally
	const html = data.loadDocument.replace('<!-- SAMPLE_LIST_HERE -->', sampleList);
</script>

<svelte:head>
	<title>{m.faq_page_title()}</title>
</svelte:head>

<main class="faq">
	<!-- eslint-disable-next-line svelte/no-at-html-tags, svelte/no-at-html-tags -->
	{@html html}
</main>
