import eslintPluginReactRecommendedConfig from 'eslint-plugin-react/configs/recommended.js';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { fixupPluginRules } from '@eslint/compat';
import jsxA11y from 'eslint-plugin-jsx-a11y';
/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export const react = [
  eslintPluginReactRecommendedConfig,
  jsxA11y.flatConfigs.recommended,
  {
    name: '@modelscope-studio/eslint-config/react',
    plugins: {
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
      'react-refresh': fixupPluginRules(reactRefresh),
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      'react/self-closing-comp': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'warn',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/alt-text': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    name: '@modelscope-studio/eslint-config/react/typescript',
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react/prop-types': 'off',
    },
  },
];
