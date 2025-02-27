import type React from 'react';
import { Attachments } from '@ant-design/x';
import type { Attachment } from '@ant-design/x/es/attachments';
import { get_fetchable_url_or_file } from '@utils/upload';
import { Flex } from 'antd';

import type { ChatbotFileContent, ChatbotFileContentConfig } from '../type';

export interface FileMessageProps {
  options: ChatbotFileContentConfig;
  value?: ChatbotFileContent;
  urlRoot: string;
  urlProxyUrl: string;
}

const resolveItem = (
  item: ChatbotFileContent[number],
  urlRoot: string,
  urlProxyUrl: string
) => {
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
    url: item.url || get_fetchable_url_or_file(item.path, urlRoot, urlProxyUrl),
  };
};

export const FileMessage: React.FC<FileMessageProps> = ({
  value,
  urlProxyUrl,
  urlRoot,
  options,
}) => {
  return (
    <Flex gap="small" wrap {...options}>
      {value?.map((file, index) => {
        const item = resolveItem(file, urlRoot, urlProxyUrl);
        return (
          <Attachments.FileCard
            item={item as Attachment}
            key={`${item.uid}-${index}`}
          />
        );
      })}
    </Flex>
  );
};
