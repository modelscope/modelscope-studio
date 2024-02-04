module.exports = {
  ignoreFiles: [
    '/**/*.min.*',
    '/**/dist/**',
    '/**/node_modules/**',
    '/**/output/**',
    '/**/coverage/**',
    '/**/public/**',
    '/**/temp/**',
    '/**/__snapshots__/**',
    '/**/tmp/**',
    '/**/build-assets/**',
    '/**/backend/**',
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
    // prettier
    'stylelint-prettier/recommended',
    'stylelint-config-ali',
  ],
  plugins: ['stylelint-declaration-block-no-ignored-properties'],
  rules: {
    'prettier/prettier': true,
    'plugin/declaration-block-no-ignored-properties': true,
    'font-family-name-quotes': null,
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    // selector
    'selector-class-pattern': [
      // convention
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: 'Expected class selector to be kebab-case',
      },
    ],
    'media-feature-range-notation': 'prefix',
  },
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
      rules: {
        'selector-pseudo-class-no-unknown': [
          true,
          {
            ignorePseudoClasses: ['global'],
          },
        ],
      },
    },
  ],
};
