module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'es5',
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: [
    require.resolve('prettier-plugin-packagejson'),
    require.resolve('prettier-plugin-svelte'),
  ],
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],
};
