import type React from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { getFetchableUrl } from '@utils/upload';
import { Button, Flex, theme } from 'antd';

import { BaseFileCard } from '../../../antdx/file-card/base';
import type { ChatbotFileContent, ChatbotFileContentConfig } from '../type';

export interface FileMessageProps {
  options: ChatbotFileContentConfig;
  value?: ChatbotFileContent;
  rootUrl: string;
  apiPrefix: string;
}

type ChatbotFileContentItem = Exclude<ChatbotFileContent[number], string>;

const resolveItem = (
  item: ChatbotFileContent[number],
  rootUrl: string,
  apiPrefix: string
): ChatbotFileContentItem => {
  if (!item) {
    return {} as ChatbotFileContentItem;
  }
  if (typeof item === 'string') {
    return {
      url: item.startsWith('http')
        ? item
        : getFetchableUrl(item, rootUrl, apiPrefix),
      uid: item,
      name: item.split('/').pop()!,
    } as ChatbotFileContentItem;
  }
  return {
    ...item,
    uid: item.uid || item.path || item.url,
    name:
      item.name || item.orig_name || (item.url || item.path).split('/').pop(),
    url: item.url || getFetchableUrl(item.path, rootUrl, apiPrefix),
  } as ChatbotFileContentItem;
};

export const FileMessage: React.FC<FileMessageProps> = ({
  value,
  apiPrefix,
  rootUrl,
  options,
}) => {
  const { imageProps, videoProps, audioProps } = options;
  const { token } = theme.useToken();
  return (
    <Flex
      gap="small"
      align="center"
      wrap
      {...options}
      className="ms-gr-pro-chatbot-message-file-message"
    >
      {value?.map((file, index) => {
        const item = resolveItem(file, rootUrl, apiPrefix);

        return (
          <BaseFileCard
            key={`${item.uid}-${index}`}
            name={item.name}
            type={item.type}
            byte={item.size}
            src={item}
            styles={{
              file: {
                maxHeight: 150,
                width: 'auto',
                maxWidth: 268,
              },
            }}
            mask={
              <Button
                icon={<EyeOutlined />}
                style={{ color: token.colorWhite }}
                variant="link"
                color="default"
                size="small"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            rootUrl={rootUrl}
            apiPrefix={apiPrefix}
            imageProps={{
              styles: {
                cover: {
                  borderRadius: token.borderRadius,
                },
                image: {
                  height: 68,
                  width: 68,
                  borderRadius: token.borderRadius,
                },
                ...imageProps?.styles,
              },
              ...imageProps,
            }}
            videoProps={videoProps}
            audioProps={{
              style: {
                width: 268,
                ...audioProps?.style,
              },
              ...audioProps,
            }}
          />
        );
      })}
    </Flex>
  );
};
