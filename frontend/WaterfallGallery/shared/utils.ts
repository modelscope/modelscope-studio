import type { FileData } from '@gradio/client';

export interface GalleryImage {
  image: FileData;
  caption?: string | null;
  liked?: boolean;
  meta?: any;
}
export type GalleryData = GalleryImage[];

export interface Breakpoints {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}
export const breakpoints: { key: keyof Breakpoints; width: number }[] = [
  {
    key: 'xs',
    width: 0,
  },
  {
    key: 'sm',
    width: 576,
  },
  {
    key: 'md',
    width: 768,
  },
  {
    key: 'lg',
    width: 992,
  },
  {
    key: 'xl',
    width: 1200,
  },
  {
    key: 'xxl',
    width: 1600,
  },
];

export async function copy_to_clipboard(value: string) {
  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(value);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = value;

    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (error) {
      return Promise.reject(error);
    } finally {
      textArea.remove();
    }
  }
}

export async function format_gallery_for_sharing(
  value: GalleryData | null
): Promise<string> {
  if (!value) return '';
  const urls = await Promise.all(
    value.map((data) => {
      if (!data.image || !data.image.url) return '';
      return data.image.url;
    })
  );

  return `<div style="display: flex; flex-wrap: wrap; gap: 16px">${urls
    .map((url) => `<img src="${url}" style="height: 400px" />`)
    .join('')}</div>`;
}
