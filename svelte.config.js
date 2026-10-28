import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// import adapter from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],

	kit: {
		adapter: adapter({
			fallback: '200.html'
		}),
		env: {
			publicPrefix: 'PUBLIC_'
		},
		// https://github.com/opral/paraglide-js/blob/main/examples/sveltekit/README.md#usage
		paths: {
			relative: false
		}
	}
};

export default config;
