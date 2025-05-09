import path from 'path-browserify-esm';

export interface FileInfo {
  code: string;
  isCss: boolean;
  originalPath: string;
}

export interface InputFileObject {
  code: string;
  is_entry?: boolean;
}

export const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css'];

export const DEFAULT_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

export const DEFAULT_ENTRY_FILES = [
  'index.tsx',
  'index.jsx',
  'index.ts',
  'index.js',
  'index.html',
];

export function normalizePath(filePath: string, dir: string = ''): string {
  let relativePath = filePath;
  if (relativePath.startsWith('/')) {
    relativePath = filePath.replace(/^\/+/, '');
  }
  return path.resolve(dir, relativePath);
}

export function renderHtmlTemplate(
  template: string,
  templateValues: Record<string, string>
) {
  return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    return templateValues[trimmedKey] !== undefined
      ? templateValues[trimmedKey]
      : match;
  });
}
