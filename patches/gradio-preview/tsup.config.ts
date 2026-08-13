import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  // `vite`, the Svelte plugin and the preprocessor are resolved at runtime from
  // this package's own dependencies; bundling them would give the dev server a
  // second Vite instance.
  external: [
    'vite',
    'rollup',
    '@sveltejs/vite-plugin-svelte',
    'svelte-preprocess',
    'svelte/compiler',
  ],
});
