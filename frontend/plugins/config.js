import path from 'node:path';
import url from 'node:url';

const frontendDir = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '..'
);

/**
 * The source aliases (keep in sync with `paths` of the root `tsconfig.json`)
 * and the production mode of the build.
 *
 * @type {() => import('vite').Plugin}
 */
export function configPlugin() {
  return {
    name: 'modelscope-studio-config',
    config(userConfig, { command }) {
      if (command === 'build') {
        userConfig.define = {
          ...userConfig.define,
          'process.env.NODE_ENV': JSON.stringify('production'),
        };
        userConfig.build ??= {};
      }

      userConfig.resolve ??= {};
      userConfig.resolve.alias = {
        ...(userConfig.resolve.alias || {}),
        '@utils': path.resolve(frontendDir, 'utils'),
        '@globals': path.resolve(frontendDir, 'globals'),
        '@svelte-preprocess-react': path.resolve(
          frontendDir,
          'svelte-preprocess-react'
        ),
      };
    },
  };
}
