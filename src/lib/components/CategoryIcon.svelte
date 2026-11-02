<script lang="ts">
	import type { TileIcon } from '#lib/content/dateTypes.ts';

	interface Props {
		name: TileIcon;
		size?: number;
	}

	let { name, size = 26 }: Props = $props();

	// 24×24 line icons, stroke = currentColor so they follow the tile's text colour.
	const paths: Record<TileIcon, string> = {
		sparkle: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
		heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
		baby: 'M12 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM9.5 15.5c1.5 1 3.5 1 5 0M12 6c0-2 2.5-2 2.5-.5',
		briefcase: 'M3 7h18v13H3zM9 7V5h6v2M3 13h18',
		home: 'M4 11l8-7 8 7v9H4zM10 20v-5h4v5',
		stroller: 'M5 6h6v6H4a7 7 0 0 0 14 0h2M8 21a1.5 1.5 0 1 0 0-.01M16 21a1.5 1.5 0 1 0 0-.01',
		rocket:
			'M12 3c4 2 6 6 5 11l-3 3h-4l-3-3c-1-5 1-9 5-11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9 17l-2 4M15 17l2 4',
		trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8',
		hug: 'M8 8a3 3 0 1 0 0-.01M16 8a3 3 0 1 0 0-.01M3 20c0-4 2.5-6 5-6s3 1 4 2c1-1 1.5-2 4-2s5 2 5 6'
	};
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d={paths[name]} />
</svg>
