import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

const config: UserConfig = {
	// WARN: this will not be necessary on your project
	logLevel: 'info',
	// WARN: this will not be necessary on your project
	build: {
		minify: false
	},
	// WARN: this will not be necessary on your project
	define: {
		__DATE__: `'${new Date().toISOString()}'`,
		__RELOAD_SW__: false,
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : '"development"'
	},
	// test: {
	// 	include: ['src/**/*.{test,spec}.{js,ts}']
	// },
	server: {
		port: 5175,
		strictPort: false,
		fs: {
			// Allow serving files from hoisted root node_modules
			allow: ['../..']
		}
	},
	preview: {
		port: 4175,
		strictPort: false
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			mode: 'production',
			// you don't need to do this if you're using generateSW strategy in your app
			strategies: 'generateSW', // : "injectManifest",
			// you don't need to do this if you're using generateSW strategy in your app
			// filename: "prompt-sw.ts",
			scope: '/',
			base: '/',
			registerType: 'autoUpdate',
			selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
			manifest: {
				short_name: 'Funniversaries App',
				name: 'Funniversaries App',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				icons: [
					{ src: '/favicon.png', type: 'image/x-icon', sizes: '16x16 32x32' },
					{ src: '/icon-48.png', type: 'image/png', sizes: '48x48', purpose: 'maskable' },
					{ src: '/icon-72.png', type: 'image/png', sizes: '72x72', purpose: 'maskable' },
					{ src: '/icon-96.png', type: 'image/png', sizes: '96x96', purpose: 'maskable' },
					{
						src: '/icon-128.png',
						type: 'image/png',
						sizes: '128x128',
						purpose: 'maskable'
					},
					{ src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
					{
						src: '/icon-192.png',
						type: 'image/png',
						sizes: '192x192',
						purpose: 'maskable'
					},
					{ src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
					{
						src: '/icon-512.png',
						type: 'image/png',
						sizes: '512x512',
						purpose: 'maskable'
					}
				]
			},
			// injectManifest: {
			// 	globPatterns: ['client/**/*.{js,css,ico,png,jpg,jpeg,svg,webp,woff,woff2}']
			// },
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,jpg,jpeg,svg,webp,woff,woff2}'],
				cleanupOutdatedCaches: true
			},
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: '/'
			},
			// if you have shared info in svelte config file put in a separate module and use it also here
			kit: {}
		})
	],
	resolve: {
		alias: {
			'./runtimeConfig': './runtimeConfig.browser'
		}
	}
};

export default config;
