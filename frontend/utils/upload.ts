import { FileData, upload_files } from '@gradio/client';

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

function get_gradio_version(): string {
  const el = document.querySelector('.gradio-container');
  if (!el) {
    return '';
  }
  const match = el.className.match(/gradio-container-(.+)/);
  return match ? match[1] : '';
}
export const gradio_version = +get_gradio_version()[0];

export function get_fetchable_url_or_file(
  path: string | null,
  server_url: string,
  proxy_url: string | null
): string {
  const prefix = gradio_version >= 5 ? 'gradio_api/' : '';

  if (path == null) {
    return proxy_url
      ? `/proxy=${proxy_url}${prefix}file=`
      : `${server_url}${prefix}file=`;
  }
  if (is_url(path)) {
    return path;
  }
  return proxy_url
    ? `/proxy=${proxy_url}${prefix}file=${path}`
    : `${server_url}/${prefix}file=${path}`;
}

// for <= gradio 4.19.1
export async function upload(
  file_data: FileData[],
  root: string,
  upload_fn: typeof upload_files = upload_files
): Promise<(FileData | null)[] | null> {
  const files = (Array.isArray(file_data) ? file_data : [file_data]).map(
    (file) => file.blob!
  );

  return await Promise.all(
    await (upload_fn as any)(root, files, undefined, undefined).then(
      (response: {
        files?: string[];
        error?: string;
        modelscope_upload_error?: boolean;
      }) => {
        if (response.modelscope_upload_error) {
          return [];
        }
        if (response.error) {
          throw new Error(response.error);
        } else {
          if (response.files) {
            return response.files.map((f, i) => {
              const file = new FileData({
                ...file_data[i],
                path: f,
                url: root + '/file=' + f,
              });
              return file;
            });
          }

          return [];
        }
      }
    )
  );
}
