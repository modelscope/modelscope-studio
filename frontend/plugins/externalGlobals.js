import {
  parseSync,
  transformFromAstSync,
  traverse,
  types as t,
} from '@babel/core';
import { esmExternalRequirePlugin } from 'vite';

/**
 * `t.identifier` only accepts a valid identifier name, so a dotted global path
 * like `window.ms_globals.React` has to be built as a member expression.
 */
function createGlobalExpression(variable) {
  const [object, ...properties] = variable.split('.');
  return properties.reduce(
    (expression, property) =>
      t.memberExpression(expression, t.identifier(property)),
    t.identifier(object)
  );
}

/**
 * Access the imported/exported name on the global expression, string literal
 * names (eg: `import { 'a-b' as c } from 'react'`) must be computed.
 */
function createGlobalMemberExpression(variable, property) {
  return t.memberExpression(
    createGlobalExpression(variable),
    t.cloneNode(property),
    t.isStringLiteral(property)
  );
}

/**
 * Keep the shared libraries external and turn their imports into
 * `window.ms_globals.*` references, see `./globals.js`.
 *
 * @type {(options: { globals: Record<string, import('./globals.js').SharedGlobal> }) => import('vite').Plugin[]}
 */
export function externalGlobalsPlugin({ globals }) {
  const externalNames = Object.keys(globals);
  if (!externalNames.length) {
    return [];
  }
  return [
    // Rolldown handles `require(<external>)` in bundled CJS modules through a
    // runtime shim that throws in the browser. `esmExternalRequirePlugin` fixes
    // that at the correct layer: it rewrites each such `require` into an ES
    // import (via a virtual facade `import * as m from '<mod>'; module.exports
    // = m`), so the shim never gets called and the resulting ES imports flow
    // through our own renderChunk transform below, which turns them into
    // `window.ms_globals.*` references alongside the code's native imports.
    //
    // The plugin owns the entire external list, so nothing gets pinned onto
    // `build.rolldownOptions.external`; duplicating the list there would let
    // the top-level `external` win during resolution and silently disable this
    // plugin (rolldown docs).
    esmExternalRequirePlugin({ external: externalNames }),
    {
      name: 'modelscope-studio-external-globals',
      renderChunk(code, chunk) {
        const id = chunk.fileName;
        if (
          !['.jsx', '.js', '.cjs', '.esm', '.tsx', '.ts'].some((ext) =>
            id.endsWith(ext)
          )
        ) {
          return;
        }
        const ast = parseSync(code, {
          sourceType: 'module',
        });
        traverse(ast, {
          ExportNamedDeclaration(nodePath) {
            const source = nodePath.node.source?.value;
            const entry = globals[source];
            if (!entry) {
              return;
            }
            const { specifiers } = nodePath.node;

            const decls = specifiers.map((specifier) => {
              return t.variableDeclarator(
                specifier.local,
                createGlobalMemberExpression(entry.ref, specifier.local)
              );
            });
            nodePath.insertBefore(t.variableDeclaration('const', decls));
            nodePath.insertAfter(t.exportNamedDeclaration(null, specifiers));
            nodePath.remove();
          },
          ImportDeclaration(nodePath) {
            const source = nodePath.node.source.value;
            const entry = globals[source];

            if (!entry) {
              return;
            }

            const { specifiers } = nodePath.node;
            // eg: import "react";
            if (specifiers.length === 0) {
              nodePath.remove();
              return;
            }
            const decls = specifiers.map((specifier) => {
              switch (specifier.type) {
                case 'ImportDefaultSpecifier':
                  // For namespace-style globals, the default export lives at
                  // `<ref>.default`. For value-style globals, `<ref>` itself
                  // already is the default value.
                  return t.variableDeclarator(
                    specifier.local,
                    entry.namespace
                      ? createGlobalMemberExpression(
                          entry.ref,
                          t.identifier('default')
                        )
                      : createGlobalExpression(entry.ref)
                  );
                case 'ImportSpecifier':
                  return t.variableDeclarator(
                    specifier.local,
                    createGlobalMemberExpression(entry.ref, specifier.imported)
                  );
                case 'ImportNamespaceSpecifier':
                  return t.variableDeclarator(
                    specifier.local,
                    createGlobalExpression(entry.ref)
                  );
                default:
                  throw new Error(
                    `Unsupported import specifier type ${specifier.type}`
                  );
              }
            });
            nodePath.insertAfter(t.variableDeclaration('const', decls));
            nodePath.remove();
          },
        });
        return transformFromAstSync(ast).code;
      },
    },
  ];
}
