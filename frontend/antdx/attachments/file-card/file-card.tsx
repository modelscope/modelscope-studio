import React, { useMemo } from 'react';
import { Attachments as XAttachments } from '@ant-design/x';
import type { Attachment } from '@ant-design/x/es/attachments';
import type { FileListCardProps } from '@ant-design/x/es/attachments/FileList/FileListCard';
import type { FileData } from '@gradio/client';
import { get_fetchable_url_or_file } from '@utils/upload';
import { theme } from 'antd';

export type FileCardProps = Omit<FileListCardProps, 'item'> & {
  urlRoot: string;
  urlProxyUrl: string;
  item?: string | (Attachment & FileData);
};

export const FileCard: React.FC<FileCardProps> = ({
  item,
  urlRoot,
  urlProxyUrl,
  ...props
}) => {
  const { token } = theme.useToken();
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
      name:
        item.name || item.orig_name || (item.url || item.path).split('/').pop(),
      url:
        item.url || get_fetchable_url_or_file(item.path, urlRoot, urlProxyUrl),
    };
  }, [item, urlProxyUrl, urlRoot]);
  return (
    <XAttachments.FileCard
      {...props}
      imageProps={{
        ...props.imageProps,
        wrapperStyle: {
          width: '100%',
          height: '100%',
          ...props.imageProps?.wrapperStyle,
        },
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: token.borderRadius,
          ...props.imageProps?.style,
        },
      }}
      item={resolvedItem as Attachment}
    />
  );
};

export default FileCard;
