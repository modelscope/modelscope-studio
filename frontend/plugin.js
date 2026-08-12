import { parseSync, transformFromAstSync, traverse, types as t } from '@babel/core';
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
 * `@gradio/preview` switches the Gradio SPA into custom component dev mode by
 * replacing the `"_NORMAL_"` marker with `"_CC_"`, but the Gradio bundle emits
 * that marker as a template literal (`globalThis.__MODE__ ??= `_NORMAL_``), so
 * the replacement silently misses: `virtual:cc-init` is never imported and the
 * page requests `/config` from the Vite dev server instead of the backend.
 * Rewrite the marker ourselves, whatever quote style is used.
 *
 * @type {() => import('vite').Plugin}
 */
export const GradioDevModePlugin = () => {
  return {
    name: 'modelscope-studio-gradio-dev-mode',
    apply: 'serve',
    transform(code) {
      if (!code.includes('globalThis.__MODE__')) {
        return;
      }
      return code.replace(
        /(["'`])_NORMAL_\1/,
        (_match, quote) => `${quote}_CC_${quote}`
      );
    },
  };
};

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
          userConfig.build ??= {};
          userConfig.build.rolldownOptions ??= {};
          userConfig.build.rolldownOptions.external = [
            ...(userConfig.build.rolldownOptions.external || []),
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
        const ast = parseSync(code, {
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
                      createGlobalMemberExpression(entry.ref, specifier.local)
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
                            ? createGlobalMemberExpression(
                                entry.ref,
                                t.identifier('default')
                              )
                            : createGlobalExpression(entry.ref)
                        );
                      case 'ImportSpecifier':
                        return t.variableDeclarator(
                          specifier.local,
                          createGlobalMemberExpression(
                            entry.ref,
                            specifier.imported
                          )
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
            },
          },
        });
        const transformed = transformFromAstSync(ast);

        return transformed.code;
      }
    },
  };
};
