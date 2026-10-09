// Libraries shared through `window.ms_globals`.
//
// `ms.Application` (the provider, built with `external: false`) bundles them
// and registers them in `frontend/svelte-preprocess-react/inject.ts`. Every
// other component (the consumers) keeps them external and reads them from
// `window.ms_globals` instead, see `./externalGlobals.js`.
//
// `inject.ts` is the single source of truth, the table is read from the
// `window.ms_globals = { ... }` object there. Every property whose value is an
// imported binding is shared under the specifier it is imported from:
//   - `import * as X from 'mod'` -> namespace: `window.ms_globals.<key>` is the
//                                   namespace object of `mod`;
//   - `import X from 'mod'`      -> value: `window.ms_globals.<key>` already is
//                                   the default export of `mod`.
// Import the module with the exact specifier the consumers use (`'@utils/...'`,
// not a relative path). A named import is not a module, it is only shared when
// the property is annotated with the specifier consumers import it from:
//   // @external @monaco-editor/loader
//   monacoLoader: loader,
//
// Consumers only read these globals lazily (after `importComponent` awaited
// `window.ms_globals.initializePromise`). The Svelte runtime is needed as soon
// as a component module is evaluated, so it is shared differently, see
// `./sharedSvelteRuntime.js`.

import { parseSync, traverse } from '@babel/core';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const INJECT_FILE = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '../svelte-preprocess-react/inject.ts'
);
const EXTERNAL_ANNOTATION_RE = /@external\s+(\S+)/;

/**
 * @typedef {{ ref: string; namespace: boolean }} SharedGlobal
 */

function isMsGlobals(node) {
  return (
    node.type === 'MemberExpression' &&
    !node.computed &&
    node.object.type === 'Identifier' &&
    node.object.name === 'window' &&
    node.property.type === 'Identifier' &&
    node.property.name === 'ms_globals'
  );
}

// `ref` is a dotted path, so only identifier keys can be shared.
function getPropertyName(property) {
  if (!property.computed && property.key.type === 'Identifier') {
    return property.key.name;
  }
}

function getExternalAnnotation(property) {
  for (const comment of property.leadingComments ?? []) {
    const match = comment.value.match(EXTERNAL_ANNOTATION_RE);
    if (match) {
      return match[1];
    }
  }
}

/**
 * @returns {Record<string, SharedGlobal>}
 */
function readSharedGlobals() {
  const fail = (message) => {
    throw new Error(`[modelscope-studio] ${INJECT_FILE}: ${message}`);
  };
  const ast = parseSync(fs.readFileSync(INJECT_FILE, 'utf-8'), {
    filename: INJECT_FILE,
    babelrc: false,
    configFile: false,
    sourceType: 'module',
    parserOpts: { plugins: ['typescript'] },
  });

  // local binding -> how it is imported
  const imports = new Map();
  let globalsObject;
  traverse(ast, {
    ImportDeclaration({ node }) {
      if (node.importKind === 'type') {
        return;
      }
      for (const specifier of node.specifiers) {
        if (specifier.importKind === 'type') {
          continue;
        }
        imports.set(specifier.local.name, {
          source: node.source.value,
          kind: specifier.type,
        });
      }
    },
    AssignmentExpression({ node }) {
      if (
        node.operator === '=' &&
        isMsGlobals(node.left) &&
        node.right.type === 'ObjectExpression'
      ) {
        if (globalsObject) {
          fail('`window.ms_globals` is assigned more than once.');
        }
        globalsObject = node.right;
      }
    },
  });
  if (!globalsObject) {
    fail('no `window.ms_globals = { ... }` assignment found.');
  }

  /** @type {Record<string, SharedGlobal>} */
  const globals = {};
  for (const property of globalsObject.properties) {
    if (property.type !== 'ObjectProperty') {
      continue;
    }
    const name = getPropertyName(property);
    const binding =
      property.value.type === 'Identifier' && imports.get(property.value.name);
    if (!name || !binding) {
      continue;
    }
    const annotation = getExternalAnnotation(property);
    let specifier;
    if (binding.kind === 'ImportSpecifier') {
      if (!annotation) {
        continue;
      }
      specifier = annotation;
    } else {
      specifier = annotation ?? binding.source;
      if (specifier.startsWith('.')) {
        fail(
          `"${name}" is imported from the relative path "${specifier}", import it with the specifier the consumers use.`
        );
      }
    }
    if (Object.hasOwn(globals, specifier)) {
      fail(`"${specifier}" is shared more than once.`);
    }
    globals[specifier] = {
      ref: `window.ms_globals.${name}`,
      namespace: binding.kind === 'ImportNamespaceSpecifier',
    };
  }
  return globals;
}

/**
 * @type {Record<string, SharedGlobal>}
 */
export const sharedGlobals = readSharedGlobals();

/**
 * The shared globals a consumer reads, minus the ones it bundles itself.
 *
 * @type {(excludes: string[]) => Record<string, SharedGlobal>}
 */
export function resolveGlobals(excludes) {
  return Object.fromEntries(
    Object.entries(sharedGlobals).filter(([name]) => !excludes.includes(name))
  );
}
