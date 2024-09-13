import { fixupPluginRules } from '@eslint/compat';
import eslintJs from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
/**
 * @type {import('eslint').Linter.Config[]}
 */
export const basic = [
  {
    ignores: [
      '**/.git/**',
      '**/node_modules/**',
      '**/*.min.*',
      '**/dist/**',
      '**/output/**',
      '**/coverage/**',
      '**/public/**',
      '**/temp/**',
      '**/tmp/**',
      '**/__snapshots__/**',
      '**/build-assets/**',
      '**/templates/**',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
  },
  eslintJs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    name: '@modelscope-studio/eslint-config/basic',
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        // for javascript
        typescript: {
          project: ['./**/tsconfig.json', './**/jsconfig.json'],
        },
      },
      'import/extensions': ['.js', '.jsx', '.mjs'],
    },
    plugins: {
      'simple-import-sort': fixupPluginRules(simpleImportSort),
      import: fixupPluginRules(eslintPluginImport),
    },
    rules: {
      // import
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/export': 'error',
      'import/no-duplicates': 'error',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',

      // prettier config
      'prettier/prettier': 'warn',
      'no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_' }],

      'require-await': 'warn',
      'require-yield': 'warn',
      'no-shadow': 'error',
      'no-debugger': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-rest-params': 'warn',
      'no-empty-pattern': 'warn',
      'no-control-regex': 'warn',

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Packages. `react` related packages come first.
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ['react', 'react-dom', '^react', '^@?\\w'],
            // Side effect imports.
            ['^\\u0000'],
            ['^@/\\w'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            [
              // Other relative imports. Put same-folder imports and `.` last.
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
            ],
            // Style imports.
            ['^.+\\.(scss|sass|less|css)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      'import/first': 'error',
      'import/newline-after-import': 'error',
    },
  },
];
