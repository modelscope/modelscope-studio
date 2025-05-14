import path from 'path-browserify-esm';

export interface FileInfo {
  code: string;
  transformedCode?: string;
  isJs: boolean;
  originalPath: string;
}

export interface InputFileObject {
  code: string;
  is_entry?: boolean;
}

export const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css'];

export const JS_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
export const DEFAULT_EXTENSIONS = JS_EXTENSIONS;

export const DEFAULT_REACT_ENTRY_FILES = [
  'index.tsx',
  'index.jsx',
  'index.ts',
  'index.js',
];
export const DEFAULT_HTML_ENTRY_FILES = ['index.html'];

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

export function getEntryFile(
  files: Record<string, string | InputFileObject>,
  template?: 'react' | 'html'
) {
  let defaultEntryFile = '';
  for (const filePath in files) {
    const fileContent = files[filePath];

    if (typeof fileContent === 'object' && fileContent.is_entry) {
      return filePath;
    }
    const normalizedFilePath = normalizePath(filePath);
    if (
      template === 'react' &&
      DEFAULT_REACT_ENTRY_FILES.includes(normalizedFilePath)
    ) {
      defaultEntryFile = filePath;
    }
    if (
      template === 'html' &&
      DEFAULT_HTML_ENTRY_FILES.includes(normalizedFilePath)
    ) {
      defaultEntryFile = filePath;
    }
  }

  return defaultEntryFile;
}

export function getFileCode(fileContent: string | InputFileObject) {
  if (typeof fileContent === 'object') {
    return fileContent.code;
  }
  return fileContent;
}
