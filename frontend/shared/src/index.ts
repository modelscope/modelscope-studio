import { FileData } from '@gradio/client';

export function normalise_file(
  file: FileData | null,
  server_url: string,
  proxy_url: string | null
): FileData | null;

export function normalise_file(
  file: FileData[] | null,
  server_url: string,
  proxy_url: string | null
): FileData[] | null;

export function normalise_file(
  file: FileData[] | FileData | null,
  server_url: string, // root: string,
  proxy_url: string | null // root_url: string | null
): FileData[] | FileData | null;

export function normalise_file(
  file: FileData[] | FileData | null,
  server_url: string, // root: string,
  proxy_url: string | null // root_url: string | null
): FileData[] | FileData | null {
  if (file == null) {
    return null;
  }

  if (Array.isArray(file)) {
    const normalized_file: (FileData | null)[] = [];

    for (const x of file) {
      if (x == null) {
        normalized_file.push(null);
      } else {
        normalized_file.push(normalise_file(x, server_url, proxy_url));
      }
    }

    return normalized_file as FileData[];
  }

  if (file.is_stream) {
    if (proxy_url == null) {
      return new FileData({
        ...file,
        url: server_url + '/stream/' + file.path,
      });
    }
    return new FileData({
      ...file,
      url: '/proxy=' + proxy_url + 'stream/' + file.path,
    });
  }

  return new FileData({
    ...file,
    url: get_fetchable_url_or_file(file.path, server_url, proxy_url),
  });
}

function is_url(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function get_fetchable_url_or_file(
  path: string | null,
  server_url: string,
  proxy_url: string | null
): string {
  if (path == null) {
    return proxy_url ? `/proxy=${proxy_url}file=` : `${server_url}/file=`;
  }
  if (is_url(path)) {
    return path;
  }
  return proxy_url
    ? `/proxy=${proxy_url}file=${path}`
    : `${server_url}/file=${path}`;
}
