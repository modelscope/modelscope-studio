import baseConfig from '@modelscope-studio/lint-config/eslint';

/**
 * @type {import('eslint').Linter.Config[]}
 */
const config = [
  {
    // Vendored `@gradio/preview`, kept byte-for-byte in sync with upstream.
    ignores: ['patches/**'],
  },
];

export default config.concat(baseConfig);
