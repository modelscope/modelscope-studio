import { parse, transformFromAstSync, traverse, types as t } from '@babel/core';
import path from 'node:path';
import url from 'node:url';

// Each entry mirrors how the global is exposed in
// `frontend/svelte-preprocess-react/inject.ts`:
//   - namespace: true  -> registered via `import * as X from 'mod'`
//                         (`window.ms_globals.<key>` is the namespace object)
//   - namespace: false -> registered via `import X from 'mod'` (or a single
//                         named binding stored directly), so
//                         `window.ms_globals.<key>` already is the value.
const baseGlobals = {
  react: { ref: 'window.ms_globals.React', namespace: false },
  'react-dom': { ref: 'window.ms_globals.ReactDOM', namespace: false },
  'react-dom/client': {
    ref: 'window.ms_globals.ReactDOMClient',
    namespace: false,
  },
  antd: { ref: 'window.ms_globals.antd', namespace: true },
  antdx: { ref: 'window.ms_globals.antdx', namespace: true },
  '@ant-design/cssinjs': {
    ref: 'window.ms_globals.antdCssinjs',
    namespace: true,
  },
  '@ant-design/icons': {
    ref: 'window.ms_globals.antdIcons',
    namespace: true,
  },

  '@svelte-preprocess-react/react-contexts': {
    ref: 'window.ms_globals.internalReactContexts',
    namespace: true,
  },
  dayjs: { ref: 'window.ms_globals.dayjs', namespace: false },
  '@utils/createItemsContext': {
    ref: 'window.ms_globals.createItemsContext',
    namespace: true,
  },
  '@globals/components': {
    ref: 'window.ms_globals.components',
    namespace: true,
  },
  '@monaco-editor/loader': {
    ref: 'window.ms_globals.monacoLoader',
    namespace: false,
  },
};

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

function generateSveltePreprocessReactAliases() {
  const baseDir = 'svelte-preprocess-react';
  const baseAlias = {
    '@svelte-preprocess-react': path.resolve(dirname, baseDir),
  };

  const moduleAliases = {};

  return {
    ...baseAlias,
    ...moduleAliases,
  };
}

/**
 * @type {(options:{ external?: { excludes:string[] } | boolean }) => import('vite').Plugin}
 */
export const ModelScopeStudioVitePlugin = ({ external = true } = {}) => {
  const globals = external?.excludes
    ? Object.keys(baseGlobals).reduce((aliases, name) => {
        if (!external.excludes.includes(name)) {
          aliases[name] = baseGlobals[name];
        }
        return aliases;
      }, {})
    : baseGlobals;
  return {
    name: 'modelscope-studio-vite-plugin',
    config(userConfig, { command }) {
      const isBuild = command === 'build';
      if (isBuild) {
        userConfig.define = {
          ...userConfig.define,
          'process.env.NODE_ENV': JSON.stringify('production'),
        };
        userConfig.build ??= {};
        if (external) {
          userConfig.build.rollupOptions ??= {};
          userConfig.build.rollupOptions.external = [
            ...(userConfig.build.rollupOptions.external || []),
            ...Object.keys(globals),
          ];
        }
      }

      userConfig.resolve ??= {};
      userConfig.resolve.alias = {
        ...(userConfig.resolve.alias || {}),
        '@utils': path.resolve(dirname, 'utils'),
        '@globals': path.resolve(dirname, 'globals'),
        ...generateSveltePreprocessReactAliases(),
      };
    },
    renderChunk(code, chunk) {
      const id = chunk.fileName;
      if (
        ['.jsx', '.js', '.cjs', '.esm', '.tsx', '.ts'].some((ext) =>
          id.endsWith(ext)
        )
      ) {
        const ast = parse(code, {
          sourceType: 'module',
        });
        traverse(ast, {
          Program: {
            enter(enterPath) {
              enterPath.traverse({
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
                      t.memberExpression(
                        t.identifier(entry.ref),
                        specifier.local
                      )
                    );
                  });
                  nodePath.insertBefore(t.variableDeclaration('const', decls));
                  nodePath.insertAfter(
                    t.exportNamedDeclaration(null, specifiers)
                  );
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
                        // For namespace-style globals, the default export
                        // lives at `<ref>.default`. For value-style globals,
                        // `<ref>` itself already is the default value.
                        return t.variableDeclarator(
                          specifier.local,
                          entry.namespace
                            ? t.memberExpression(
                                t.identifier(entry.ref),
                                t.identifier('default')
                              )
                            : t.identifier(entry.ref)
                        );
                      case 'ImportSpecifier':
                        return t.variableDeclarator(
                          specifier.local,
                          t.memberExpression(
                            t.identifier(entry.ref),
                            specifier.imported
                          )
                        );
                      case 'ImportNamespaceSpecifier':
                        return t.variableDeclarator(
                          specifier.local,
                          t.identifier(entry.ref)
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
            },
          },
        });
        const transformed = transformFromAstSync(ast);

        return transformed.code;
      }
    },
  };
};
