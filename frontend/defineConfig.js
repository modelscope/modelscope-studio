import react from '@vitejs/plugin-react-swc';

import { ModelScopeStudioVitePlugin } from './plugin.js';

/**
 * @type {(options:{ external?: boolean | { excludes:string[] } }) => any}
 */
export default ({ external } = { external: true }) => {
  return {
    plugins: [react(), ModelScopeStudioVitePlugin({ external })],
    svelte: {
      preprocess: [],
    },
    build: {
      target: 'modules',
    },
  };
};
