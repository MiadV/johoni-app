/**
 * @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options &
 *       import("@ianvs/prettier-plugin-sort-imports").PluginConfig}
 */
module.exports = {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  tailwindConfig: './tailwind.config.js',
  endOfLine: 'lf',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: false,
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^~/utils/(.*)$',
    '^~/contexts/(.*)$',
    '^~/hooks/(.*)$',
    '^~/lib/(.*)$',
    '^~/layouts/(.*)$',
    '^~/components/(.*)$',
    '^~/styles/(.*)$',
    '^[./]',
    '^types$',
    '<TYPES>',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
};
