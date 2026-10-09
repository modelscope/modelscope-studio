// Vite plugins of every component build, see `frontend/defineConfig.js`.
//
// Each component is built on its own, and `external` decides its role:
//   - `false`, the provider (only `ms.Application`): bundles the shared
//     libraries and the Svelte runtime, and registers them on
//     `window.ms_globals` (`frontend/svelte-preprocess-react/inject.ts`);
//   - `true` (default) or `{ excludes }`, a consumer: reads them from
//     `window.ms_globals` instead of bundling its own copy. `excludes` lists
//     the ones it bundles itself (keys of `./globals.js`, or `'svelte'`).
//
//   - `./globals.js`               the shared libraries, read from `inject.ts`
//   - `./externalGlobals.js`       consumers read the shared libraries
//   - `./sharedSvelteRuntime.js`   consumers run on the provider's Svelte runtime
//   - `./prismLanguages.js`        fix of CodeHighlighter language loading
//   - `./config.js`                aliases and production mode

import { configPlugin } from './config.js';
import { externalGlobalsPlugin } from './externalGlobals.js';
import { resolveGlobals } from './globals.js';
import { prismLanguagesPlugin } from './prismLanguages.js';
import { sharedSvelteRuntimePlugin } from './sharedSvelteRuntime.js';

/**
 * @type {(options?: { external?: { excludes: string[] } | boolean }) => import('vite').Plugin[]}
 */
export const ModelScopeStudioVitePlugin = ({ external = true } = {}) => {
  const consumer = !!external;
  const excludes = (consumer && external.excludes) || [];
  return [
    sharedSvelteRuntimePlugin({
      consumer: consumer && !excludes.includes('svelte'),
    }),
    prismLanguagesPlugin(),
    ...externalGlobalsPlugin({
      globals: consumer ? resolveGlobals(excludes) : {},
    }),
    configPlugin(),
  ];
};
