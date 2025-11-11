import { parse, transformFromAstSync, traverse, types as t } from '@babel/core';
import fg from 'fast-glob';
import path from 'node:path';
import url from 'node:url';

const baseGlobals = {
  react: 'window.ms_globals.React',
  'react-dom': 'window.ms_globals.ReactDOM',
  'react-dom/client': 'window.ms_globals.ReactDOMClient',
  antd: 'window.ms_globals.antd',
  antdx: 'window.ms_globals.antdx',
  '@ant-design/cssinjs': 'window.ms_globals.antdCssinjs',
  '@ant-design/icons': 'window.ms_globals.antdIcons',
  '@svelte-preprocess-react/context': 'window.ms_globals.internalContext',
  dayjs: 'window.ms_globals.dayjs',
  '@utils/createItemsContext': 'window.ms_globals.createItemsContext',
  '@globals/components': 'window.ms_globals.components',
  '@monaco-editor/loader': 'window.ms_globals.monacoLoader',
};

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

function generateSveltePreprocessReactAliases() {
  const baseDir = 'svelte-preprocess-react';
  const baseAlias = {
    '@svelte-preprocess-react': path.resolve(dirname, baseDir),
  };

  const files = fg.sync([`${baseDir}/*.ts`, `${baseDir}/*.tsx`], {
    cwd: dirname,
    absolute: false,
  });

  const moduleAliases = files.reduce((aliases, file) => {
    const fileName = path.basename(file, path.extname(file));
    aliases[`@svelte-preprocess-react/${fileName}`] = path.resolve(
      dirname,
      file
    );
    return aliases;
  }, {});

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
        if (external) {
          userConfig.build ??= {};
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
                  const variable = globals[source];
                  if (!variable) {
                    return;
                  }
                  const { specifiers } = nodePath.node;

                  const decls = specifiers.map((specifier) => {
                    return t.variableDeclarator(
                      specifier.local,
                      t.memberExpression(
                        t.identifier(variable),
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
                  const variable = globals[source];

                  if (!variable) {
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
                        return t.variableDeclarator(
                          specifier.local,
                          t.identifier(variable)
                        );
                      case 'ImportSpecifier':
                        return t.variableDeclarator(
                          specifier.local,
                          t.memberExpression(
                            t.identifier(variable),
                            specifier.imported
                          )
                        );
                      case 'ImportNamespaceSpecifier':
                        return t.variableDeclarator(
                          specifier.local,
                          t.identifier(variable)
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
