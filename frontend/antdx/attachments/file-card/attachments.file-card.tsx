import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { Attachments as XAttachments } from '@ant-design/x';
import type { Attachment } from '@ant-design/x/es/attachments';
import type { FileListCardProps } from '@ant-design/x/es/attachments/FileList/FileListCard';
import type { FileData } from '@gradio/client';
import { get_fetchable_url_or_file } from '@utils/upload';

export const AttachmentsFileCard = sveltify<
  Omit<FileListCardProps, 'item'> & {
    urlRoot: string;
    urlProxyUrl: string;
    item?: string | (Attachment & FileData);
  }
>(({ item, urlRoot, urlProxyUrl, ...props }) => {
  const resolvedItem = useMemo(() => {
    if (!item) {
      return {};
    }
    if (typeof item === 'string') {
      return {
        url: item.startsWith('http')
          ? item
          : get_fetchable_url_or_file(item, urlRoot, urlProxyUrl),
        uid: item,
        name: item.split('/').pop(),
      };
    }
    return {
      ...item,
      uid: item.uid || item.path || item.url,
      name: item.name || item.orig_name || item.path.split('/').pop(),
      url:
        item.url || get_fetchable_url_or_file(item.path, urlRoot, urlProxyUrl),
    };
  }, [item, urlProxyUrl, urlRoot]);
  return <XAttachments.FileCard {...props} item={resolvedItem as Attachment} />;
});

export default AttachmentsFileCard;
