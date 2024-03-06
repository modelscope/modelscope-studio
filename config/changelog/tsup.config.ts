import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/fix-changelog.ts'],
  splitting: false,
  dts: true,
  format: ['esm', 'cjs'],
  sourcemap: false,
  clean: true,
  outExtension({ format }) {
    if (format === 'cjs') {
      return {
        js: `.cjs`,
      };
    }
    return {
      js: `.mjs`,
    };
  },
});
