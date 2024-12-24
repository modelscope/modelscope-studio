import eslintPluginImport from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
/**
 * @type {import('eslint').Linter.Config[]}
 */
export const typescript = [
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx,svelte}'],
  })),
  {
    ...eslintPluginImport.configs.typescript,
    name: '@modelscope-studio/eslint-config/fixup-import-typescript',
    files: ['**/*.{ts,tsx,svelte}'],
  },
  {
    name: '@modelscope-studio/eslint-config/typescript',
    files: ['**/*.{ts,tsx,svelte}'],
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./**/tsconfig.json', './**/jsconfig.json'],
        },
      },
    },
    rules: {
      'no-shadow': 'off',
      'import/default': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': [
        'warn',
        {
          allowSingleExtends: true,
        },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': 'allow-with-description' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      // import type
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', disallowTypeAnnotations: false },
      ],
    },
  },
];
