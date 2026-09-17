import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: ['.svelte']
			}
		}
	},
	{
		ignores: ['node_modules/', '.svelte-kit/', 'build/', 'dev-dist/']
	}
);
// .DS_Store
// node_modules
// /build
// /.svelte-kit
// /package
// .env
// .env.*
// !.env.example
//
// # Ignore files for PNPM, NPM and YARN
// pnpm-lock.yaml
// package-lock.json
// yarn.lock
