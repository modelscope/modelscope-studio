import { parse, transformFromAstSync, traverse, types as t } from '@babel/core';
import path from 'path';
import url from 'url';

const globals = {
  react: 'window.ms_globals.React',
  'react-dom': 'window.ms_globals.ReactDOM',
  'react-dom/client': 'window.ms_globals.ReactDOMClient',
  antd: 'window.ms_globals.antd',
  antdx: 'window.ms_globals.antdx',
  '@ant-design/cssinjs': 'window.ms_globals.antdCssinjs',
  '@ant-design/icons': 'window.ms_globals.antdIcons',
  '@svelte-preprocess-react/context': 'window.ms_globals.internalContext',
  dayjs: 'window.ms_globals.dayjs',
};

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
/**
 * @type {(options:{ external?:boolean }) => import('vite').Plugin}
 */
export const ModelScopeStudioVitePlugin = ({ external = true } = {}) => {
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
        '@svelte-preprocess-react/inject': path.resolve(
          dirname,
          'svelte-preprocess-react/inject.ts'
        ),
        '@svelte-preprocess-react/provider': path.resolve(
          dirname,
          'svelte-preprocess-react/provider.ts'
        ),
        '@svelte-preprocess-react/component': path.resolve(
          dirname,
          'svelte-preprocess-react/component.ts'
        ),
        '@svelte-preprocess-react/slot': path.resolve(
          dirname,
          'svelte-preprocess-react/slot.ts'
        ),
        ...(isBuild
          ? {}
          : {
              '@svelte-preprocess-react/context': path.resolve(
                dirname,
                'svelte-preprocess-react/context.ts'
              ),
            }),
        '@svelte-preprocess-react/react-slot': path.resolve(
          dirname,
          'svelte-preprocess-react/react-slot.tsx'
        ),
        '@svelte-preprocess-react': path.resolve(
          dirname,
          'svelte-preprocess-react'
        ),
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
