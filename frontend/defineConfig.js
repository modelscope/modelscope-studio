import react from '@vitejs/plugin-react';

import { GradioDevModePlugin, ModelScopeStudioVitePlugin } from './plugin.js';

/**
 * @type {(options:{ external?: boolean | { excludes:string[] } }) => any}
 */
export default ({ external } = { external: true }) => {
  return {
    plugins: [
      react(),
      ModelScopeStudioVitePlugin({ external }),
      GradioDevModePlugin(),
    ],
    svelte: {
      preprocess: [],
    },
    build: {
      target: 'modules',
    },
  };
};
