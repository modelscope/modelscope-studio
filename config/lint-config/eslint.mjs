import { react } from './configs/eslint/react.mjs';

import { basic } from './configs/eslint/basic.mjs';
import { svelte } from './configs/eslint/svelte.mjs';
import { typescript } from './configs/eslint/typescript.mjs';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [].concat(basic, react, typescript, svelte);
