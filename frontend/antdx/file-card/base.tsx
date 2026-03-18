import React, { useMemo } from 'react';
import {
  FileCard as XFileCard,
  type FileCardProps as XFileCardProps,
} from '@ant-design/x';
import type { FileData } from '@gradio/client';
import { getFetchableUrl } from '@utils/upload';

export type BaseFileCardProps = Omit<XFileCardProps, 'src'> & {
  rootUrl: string;
  apiPrefix: string;
  src?: string | FileData;
};

export function resolveFileSrc(
  src: string | FileData | undefined,
  rootUrl: string,
  apiPrefix: string
) {
  if (!src) {
    return src;
  }
  if (typeof src === 'string') {
    return src.startsWith('http')
      ? src
      : getFetchableUrl(src, rootUrl, apiPrefix);
  }
  return src.url || getFetchableUrl(src.path, rootUrl, apiPrefix);
}

export const BaseFileCard: React.FC<BaseFileCardProps> = ({
  src,
  rootUrl,
  apiPrefix,
  ...props
}) => {
  const resolvedSrc = useMemo(() => {
    return resolveFileSrc(src, rootUrl, apiPrefix);
  }, [src, apiPrefix, rootUrl]);
  return <XFileCard {...props} src={resolvedSrc} />;
};

export default BaseFileCard;
