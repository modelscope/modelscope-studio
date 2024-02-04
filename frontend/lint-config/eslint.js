module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ignorePatterns: [
    '*.min.*',
    'node_modules',
    'dist',
    'output',
    'coverage',
    'public',
    'temp',
    '__snapshots__',
    'build-assets',
    'tmp',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    // react
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['simple-import-sort'],
  settings: {
    'import/resolver': {
      // for javascript
      typescript: {
        project: ['./**/tsconfig.json', './**/jsconfig.json'],
      },
    },
    'import/extensions': ['.js', '.jsx', '.mjs'],
    react: {
      version: '18.2.0',
    },
  },
  rules: {
    // prettier
    'prettier/prettier': 'warn',
    'no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_' }],
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
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
          ['react', 'react-dom', 'dumi', '^react', '^@?\\w'],
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
    'import/no-duplicates': 'error',
    // react
    'react/self-closing-comp': 'error',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/alt-text': 'warn',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
      ],
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            project: ['./**/tsconfig.json', './**/jsconfig.json'],
          },
        },
        'import/extensions': ['.ts', '.tsx', '.d.ts'],
      },
      rules: {
        'react/prop-types': 'off',
        'no-shadow': 'off',
        'import/default': 'off',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/ban-ts-comment': [
          'error',
          { 'ts-ignore': 'allow-with-description' },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { vars: 'all', varsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              '{}': false,
            },
            extendDefaults: true,
          },
        ],
      },
    },
    {
      extends: ['plugin:svelte/recommended'],
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      rules: {
        'svelte/no-at-html-tags': 'off',
      },
    },
  ],
};
