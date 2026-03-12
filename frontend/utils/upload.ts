import { type FileData } from '@gradio/client';

function isUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getFetchableUrl(
  path: string,
  rootUrl: string,
  apiPrefix: string
): string {
  if (isUrl(path)) {
    return path;
  }
  return `${rootUrl}${apiPrefix}/file=${path}`;
}

const isFileData = (v: FileData | any): v is FileData => {
  return !!(v as FileData).url;
};

export function getFileUrl<T extends FileData | any>(
  file: T,
  rootUrl: string,
  apiPrefix: string
): string | Exclude<T, FileData> | undefined {
  if (!file) {
    return;
  }
  if (isFileData(file)) {
    return file.url as string;
  }
  if (typeof file === 'string') {
    return file.startsWith('http')
      ? file
      : getFetchableUrl(file, rootUrl, apiPrefix);
  }
  return file as Exclude<T, FileData>;
}
