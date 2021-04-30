module.exports = {
  parser: '@typescript-eslint/parser',
	env: {
		browser: true,
		node: true,
		es6: true,
		'cypress/globals': true,
	},
	extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:cypress/recommended',
    'prettier'
  ],
	overrides: [
		{
			files: ['**/*.svelte'],
			processor: 'svelte3/svelte3',
		},
	],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.svelte']
  },
  settings: {
    'svelte3/typescript': require('typescript'),
    // ignore style tags in Svelte because of Tailwind CSS
    // See https://github.com/sveltejs/eslint-plugin-svelte3/issues/70
    'svelte3/ignore-styles': () => true,
  },
	plugins: [
    'svelte3',
    'cypress',
    '@typescript-eslint',
  ],
  ignorePatterns: ['node_modules']
};
