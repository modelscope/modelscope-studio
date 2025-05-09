import { packages, transform } from '@babel/standalone';
import path from 'path-browserify-esm';

import {
  DEFAULT_ENTRY_FILES,
  DEFAULT_EXTENSIONS,
  FILE_EXTENSIONS,
  type FileInfo,
  type InputFileObject,
  normalizePath,
} from './utils';

export class WebSandboxParser {
  private filesMap: Record<string, FileInfo> = {};
  private entryFilePath = '';
  private options: {
    importMap: Record<string, string>;
    files: Record<string, string | InputFileObject>;
  };
  constructor(options: typeof this.options) {
    this.options = options;
  }

  private _normalizeFiles(files: Record<string, string | InputFileObject>) {
    let foundEntry = false;
    const normalizedFiles: typeof this.filesMap = {};
    Object.entries(files).forEach(([filePath, fileContent]) => {
      let code: string;
      let isEntry = false;

      if (typeof fileContent === 'string') {
        code = fileContent;
      } else {
        code = fileContent.code;
        isEntry = !!fileContent.is_entry;
      }

      const normalizedPath = normalizePath(filePath);

      if (
        isEntry ||
        (!foundEntry && DEFAULT_ENTRY_FILES.includes(normalizedPath))
      ) {
        isEntry = true;
        foundEntry = true;
        this.entryFilePath = normalizedPath;
      }

      const isCss = normalizedPath.endsWith('.css');

      normalizedFiles[normalizedPath] = {
        code,
        isCss,
        originalPath: filePath,
      };
    });
    return normalizedFiles;
  }

  private _buildDependencyGraph(files: typeof this.filesMap) {
    const graph = new Map<string, Set<string>>();

    // Initialize graph
    Object.keys(files).forEach((file) => {
      graph.set(file, new Set());
    });

    // Analyze dependencies for each non-CSS file
    for (const [filePath, fileInfo] of Object.entries(files)) {
      if (fileInfo.isCss) continue;
      const dependencies = new Set<string>();

      // Parse code to generate AST
      const ast = packages.parser.parse(fileInfo.code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      // Traverse AST to find import declarations
      packages.traverse.default(ast, {
        ImportDeclaration: (nodePath) => {
          const importPath = nodePath.node.source.value;

          const resolvedImportPath = this._processImportPath(
            importPath,
            filePath,
            files
          );

          if (files[resolvedImportPath]) {
            dependencies.add(resolvedImportPath);
          }
        },
      });

      // Store dependency relationships in the graph
      dependencies.forEach((dep) => {
        graph.get(filePath)?.add(dep);
      });
    }

    return graph;
  }

  private _processImportPath(
    importPath: string,
    filePath: string,
    files: typeof this.filesMap
  ) {
    if (!(importPath.startsWith('./') || importPath.startsWith('../'))) {
      return importPath;
    }
    const dir = filePath.includes('/')
      ? filePath.substring(0, filePath.lastIndexOf('/'))
      : '';

    const normalizedPath = normalizePath(importPath, dir);
    // If the path already has an extension and the file exists
    if (files[normalizedPath]) {
      return normalizedPath;
    }

    // Check if file exists after adding extension
    for (const ext of FILE_EXTENSIONS) {
      if (files[`${normalizedPath}${ext}`]) {
        return `${normalizedPath}${ext}`;
      }
    }

    // Check if it's a directory reference (looking for index files)
    for (const ext of DEFAULT_EXTENSIONS) {
      const indexPath = path
        .join(importPath, `index${ext}`)
        .replace(/\\/g, '/');
      if (files[indexPath]) {
        return indexPath;
      }
    }

    return normalizedPath;
  }
  // Topological sort, reports error for circular dependencies and identifies involved files
  private _topologicalSort(
    graph: Map<string, Set<string>>,
    files: typeof this.filesMap
  ) {
    const visited = new Set<string>();
    const temp = new Set<string>();
    const result: string[] = [];

    function dfs(node: string) {
      if (temp.has(node)) return { dep: node, cycle: true }; // Circular dependency
      if (visited.has(node)) return { cycle: false }; // Already visited

      temp.add(node);

      // First process all dependencies
      const dependencies = graph.get(node) || new Set();
      for (const dep of dependencies) {
        const { cycle } = dfs(dep);
        if (cycle) {
          return {
            dep,
            cycle: true,
          };
        }
      }

      temp.delete(node);
      visited.add(node);
      result.push(node);
      return { cycle: false };
    }

    // Traverse all nodes
    for (const node of graph.keys()) {
      if (!visited.has(node)) {
        const { cycle, dep } = dfs(node);
        if (cycle && dep) {
          throw new Error(
            `Circular dependency detected: ${files[dep].originalPath} <=> ${files[node].originalPath}`
          );
        }
      }
    }

    return result;
  }

  private _transform(files: string[], filesMap: typeof this.filesMap) {
    const compileErrors: {
      file: string;
      message: string;
    }[] = [];
    const blobUrlMap = new Map<string, string>(); // File path to blobUrl mapping
    // Collect all external and relative CSS imports
    const externalCssImports = new Set<string>();
    const relativeCssImports = new Set<string>();

    files.forEach((filePath) => {
      const fileInfo = filesMap[filePath];
      if (!fileInfo || fileInfo.isCss) return;

      try {
        // Transform code, replace relative import paths with Blob URLs
        const result = transform(fileInfo.code, {
          presets: [['react', { runtime: 'automatic' }], 'typescript'],
          plugins: [
            {
              visitor: {
                ImportDeclaration: (nodePath) => {
                  const source = nodePath.node.source;
                  if (!source || !source.value) return;
                  const importPath = source.value;
                  const resolvedImportPath = this._processImportPath(
                    importPath,
                    filePath,
                    filesMap
                  );
                  if (filesMap[resolvedImportPath]) {
                    if (resolvedImportPath.endsWith('.css')) {
                      nodePath.remove();
                      relativeCssImports.add(resolvedImportPath);
                      return;
                    }

                    // Process JS files, check if blobUrl already exists
                    const blobUrl = blobUrlMap.get(resolvedImportPath);
                    if (blobUrl) {
                      nodePath.node.source.value = blobUrl;
                      return;
                    }
                  } // Process third-party CSS imports
                  else if (
                    resolvedImportPath.includes('.css') ||
                    (resolvedImportPath.includes('style') &&
                      !resolvedImportPath.includes('.js'))
                  ) {
                    externalCssImports.add(resolvedImportPath);
                    nodePath.remove();
                  }
                },
              },
            },
          ],
          filename: filePath,
        });

        if (result?.code) {
          // Create new Blob URL
          const blob = new Blob([result.code], {
            type: 'application/javascript',
          });
          const blobUrl = URL.createObjectURL(blob);
          blobUrlMap.set(filePath, blobUrl);
        }
      } catch (e) {
        let message = '';
        if (e instanceof Error) {
          message = e.message;
        } else if (typeof e === 'string') {
          message = e;
        }
        compileErrors.push({ file: filePath, message });
      }
    });

    const styleSheetUrls = [
      ...Array.from(relativeCssImports).map((filePath) => {
        const blob = new Blob([filesMap[filePath].code], {
          type: 'text/css',
        });
        const blobUrl = URL.createObjectURL(blob);
        blobUrlMap.set(filePath, blobUrl);

        return blobUrl;
      }),
      ...Array.from(externalCssImports)
        .map((filePath) => {
          if (filePath.startsWith('http') || this.options.importMap[filePath]) {
            return filePath;
          }
          return '';
        })
        .filter(Boolean),
    ];

    return {
      compileErrors,
      blobUrlMap,
      styleSheetUrls,
    };
  }

  parse() {
    this.filesMap = this._normalizeFiles(this.options.files);
    const graph = this._buildDependencyGraph(this.filesMap);
    const sortedFiles = this._topologicalSort(graph, this.filesMap);
    const { compileErrors, styleSheetUrls, blobUrlMap } = this._transform(
      sortedFiles,
      this.filesMap
    );
    if (compileErrors.length > 0) {
      throw new Error(
        compileErrors
          .map((err) => `File ${err.file} compile error: ${err.message}`)
          .join('\n')
      );
    }
    const entryUrl = this.entryFilePath
      ? blobUrlMap.get(this.entryFilePath) || ''
      : '';
    return {
      entryUrl,
      styleSheetUrls,
      cleanup() {
        blobUrlMap.values().forEach((url) => {
          URL.revokeObjectURL(url);
        });
      },
    };
  }
}
