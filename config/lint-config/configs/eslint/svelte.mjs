import eslintPluginSvelte from 'eslint-plugin-svelte';

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export const svelte = [
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte', '*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {
      'svelte/no-at-html-tags': 'off',
    },
  },
];
