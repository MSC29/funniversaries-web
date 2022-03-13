module.exports = {
	env: {
		es6: true,
		node: true
	},
	ignorePatterns: ['src/**/*.test.ts*'],
	plugins: [
		'eslint-plugin-import',
		'eslint-plugin-jsdoc',
		'eslint-plugin-prefer-arrow',
		'@typescript-eslint',
		'security',
		'security-node',
		'prototype-pollution-security-rules',
		'sonarjs'
	],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
		'plugin:security/recommended',
		'plugin:security-node/recommended',
		'plugin:sonarjs/recommended'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module'
	},
	rules: {
		/** prototype-pollution-security-rules **/
		'prototype-pollution-security-rules/detect-merge': 1,
		'prototype-pollution-security-rules/detect-merge-objects': 1,
		'prototype-pollution-security-rules/detect-merge-options': 1,
		'prototype-pollution-security-rules/detect-deep-extend': 1,
		/** SonarJS rules (remove to use recommended and make them errors) **/
		'sonarjs/cognitive-complexity': 1,
		'sonarjs/max-switch-cases': 1,
		'sonarjs/no-all-duplicated-branches': 1,
		'sonarjs/no-collapsible-if': 1,
		'sonarjs/no-collection-size-mischeck': 1,
		'sonarjs/no-duplicate-string': 1,
		'sonarjs/no-duplicated-branches': 1,
		'sonarjs/no-element-overwrite': 1,
		'sonarjs/no-extra-arguments': 1,
		'sonarjs/no-identical-conditions': 1,
		'sonarjs/no-identical-functions': 1,
		'sonarjs/no-identical-expressions': 1,
		'sonarjs/no-inverted-boolean-check': 1,
		'sonarjs/no-one-iteration-loop': 1,
		'sonarjs/no-redundant-boolean': 1,
		'sonarjs/no-redundant-jump': 1,
		'sonarjs/no-same-line-conditional': 1,
		'sonarjs/no-small-switch': 1,
		'sonarjs/no-unused-collection': 1,
		'sonarjs/no-use-of-empty-return-value': 1,
		'sonarjs/no-useless-catch': 1,
		'sonarjs/prefer-immediate-return': 1,
		'sonarjs/prefer-object-literal': 1,
		'sonarjs/prefer-single-boolean-return': 1,
		'sonarjs/prefer-while': 1,
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/array-type': [
			'error',
			{
				default: 'array'
			}
		],
		'@typescript-eslint/await-thenable': 'error',
		'@typescript-eslint/ban-ts-comment': 'error',
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					Object: {
						message: 'Avoid using the `Object` type. Did you mean `object`?'
					},
					Function: {
						message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
					},
					Boolean: {
						message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'
					},
					Number: {
						message: 'Avoid using the `Number` type. Did you mean `number`?'
					},
					String: {
						message: 'Avoid using the `String` type. Did you mean `string`?'
					},
					Symbol: {
						message: 'Avoid using the `Symbol` type. Did you mean `symbol`?'
					}
				}
			}
		],
		'@typescript-eslint/consistent-type-assertions': 'error',
		'@typescript-eslint/dot-notation': 'off',
		'@typescript-eslint/explicit-member-accessibility': [
			'off',
			{
				accessibility: 'explicit'
			}
		],
		'@typescript-eslint/explicit-module-boundary-types': 'warn',
		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'semi',
					requireLast: true
				},
				singleline: {
					delimiter: 'semi',
					requireLast: false
				}
			}
		],
		'@typescript-eslint/member-ordering': 'error',
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'property',
				format: null,
				filter: {
					regex: '^(__v)$',
					match: true
				}
			}
		],
		'@typescript-eslint/no-array-constructor': 'error',
		'@typescript-eslint/no-empty-function': 'error',
		'@typescript-eslint/no-empty-interface': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-extra-non-null-assertion': 'error',
		'@typescript-eslint/no-extra-semi': 'error',
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/no-for-in-array': 'error',
		'@typescript-eslint/no-implied-eval': 'error',
		'@typescript-eslint/no-inferrable-types': [
			'off',
			{
				ignoreProperties: true
			}
		],
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-misused-promises': 'error',
		'@typescript-eslint/no-namespace': 'error',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
		'@typescript-eslint/no-non-null-assertion': 'warn',
		'@typescript-eslint/no-parameter-properties': 'off',
		'@typescript-eslint/no-this-alias': 'error',
		'@typescript-eslint/no-unnecessary-type-assertion': 'error',
		'@typescript-eslint/no-shadow': 'error',
		//deactivated since dependencies may not have a typedef and const functions typedef are giving errors in Fastify
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'error',
		'@typescript-eslint/no-unused-expressions': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/prefer-as-const': 'error',
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/prefer-namespace-keyword': 'error',
		'@typescript-eslint/prefer-regexp-exec': 'error',
		'@typescript-eslint/quotes': ['error', 'single'],
		'@typescript-eslint/require-await': 'error',
		'@typescript-eslint/restrict-plus-operands': 'error',
		'@typescript-eslint/restrict-template-expressions': [
			'error',
			{
				allowNumber: true,
				allowBoolean: true,
				allowAny: true,
				allowNullish: true
			}
		],
		'@typescript-eslint/semi': ['error', 'always'],
		'@typescript-eslint/triple-slash-reference': [
			'error',
			{
				path: 'always',
				types: 'prefer-import',
				lib: 'always'
			}
		],
		// '@typescript-eslint/tslint/config': [
		// 	'error',
		// 	{
		// 		rules: {
		// 			typedef: true,
		// 			whitespace: true
		// 		}
		// 	}
		// ],
		'@typescript-eslint/typedef': [
			'error',
			{
				arrowParameter: true,
				variableDeclaration: true,
				arrayDestructuring: true,
				arrowParameter: true,
				memberVariableDeclaration: true,
				objectDestructuring: true,
				parameter: true,
				propertyDeclaration: true,
				variableDeclaration: true,
				variableDeclarationIgnoreFunction: true
			}
		],
		'@typescript-eslint/type-annotation-spacing': 'error',
		'@typescript-eslint/unbound-method': 'error',
		'@typescript-eslint/unified-signatures': 'error',
		'brace-style': ['off', 'off'],
		'comma-dangle': 'error',
		complexity: 'off',
		'constructor-super': 'error',
		curly: 'error',
		'eol-last': 'error',
		eqeqeq: ['error', 'smart'],
		'guard-for-in': 'error',
		'id-blacklist': 'off',
		'id-match': 'off',
		'import/order': 'off',
		'jsdoc/check-alignment': 'error',
		'jsdoc/check-indentation': 'error',
		'jsdoc/newline-after-description': 'error',
		'max-classes-per-file': ['error', 1],
		'max-len': [
			'error',
			{
				code: 190
			}
		],
		'new-parens': 'error',
		'no-array-constructor': 'off',
		'no-bitwise': 'off',
		'no-caller': 'error',
		'no-cond-assign': 'error',
		'no-console': [
			'error'
			/* {
				allow: [
					"log",
					"warn",
					"dir",
					"timeLog",
					"assert",
					"clear",
					"count",
					"countReset",
					"group",
					"groupEnd",
					"table",
					"dirxml",
					"error",
					"groupCollapsed",
					"Console",
					"profile",
					"profileEnd",
					"timeStamp",
					"context"
				]
			} */
		],
		'no-debugger': 'error',
		'no-empty': 'error',
		'no-empty-function': 'off',
		'no-eval': 'error',
		'no-extra-semi': 'off',
		'no-fallthrough': 'error',
		'no-implied-eval': 'off',
		'no-invalid-this': 'off',
		'no-new-wrappers': 'error',
		'no-redeclare': 'error',
		// note you must disable the base rule as it can report incorrect errors (enums)
		'no-shadow': 'off',
		'no-throw-literal': 'error',
		'no-trailing-spaces': 'off',
		'no-undef-init': 'error',
		'no-underscore-dangle': 'off',
		'no-unsafe-finally': 'error',
		'no-unused-labels': 'error',
		'no-unused-vars': 'off',
		'no-var': 'error',
		'object-shorthand': 'error',
		'one-var': ['error', 'never'],
		'prefer-arrow/prefer-arrow-functions': 'error',
		'prefer-const': [
			'error',
			{
				destructuring: 'all',
				ignoreReadBeforeAssign: true
			}
		],
		radix: 'error',
		'require-await': 'off',
		'use-isnan': 'error',
		'valid-typeof': 'off'
	}
};
