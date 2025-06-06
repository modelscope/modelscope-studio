import type React from 'react';
import { useMemo } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import type { Attachment } from '@ant-design/x/es/attachments';
import { get_fetchable_url_or_file } from '@utils/upload';
import { Button, Flex, theme } from 'antd';

import { FileCard } from '../../../antdx/attachments/file-card/file-card';
import type { ChatbotFileContent, ChatbotFileContentConfig } from '../type';

const IMG_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];

function matchExt(suffix: string, ext: string[]) {
  return ext.some((e) => suffix.toLowerCase() === `.${e}`);
}
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
): Attachment => {
  if (!item) {
    return {} as Attachment;
  }
  if (typeof item === 'string') {
    return {
      url: item.startsWith('http')
        ? item
        : get_fetchable_url_or_file(item, urlRoot, urlProxyUrl),
      uid: item,
      name: item.split('/').pop(),
    } as Attachment;
  }
  return {
    ...item,
    uid: item.uid || item.path || item.url,
    name:
      item.name || item.orig_name || (item.url || item.path).split('/').pop(),
    url: item.url || get_fetchable_url_or_file(item.path, urlRoot, urlProxyUrl),
  } as Attachment;
};

const FileContainer: React.FC<{
  item: Attachment;
  children: React.ReactNode;
}> = ({ children, item }) => {
  const { token } = theme.useToken();
  const isImg = useMemo(() => {
    const nameStr = item.name || '';
    const match = nameStr.match(/^(.*)\.[^.]+$/);
    const nameSuffix = match ? nameStr.slice(match[1].length) : '';
    return matchExt(nameSuffix, IMG_EXTS);
  }, [item.name]);

  return (
    <div
      className="ms-gr-pro-chatbot-message-file-message-container"
      style={{
        borderRadius: token.borderRadius,
      }}
    >
      {isImg ? (
        <> {children}</>
      ) : (
        <>
          {children}
          <div
            className="ms-gr-pro-chatbot-message-file-message-toolbar"
            style={{
              backgroundColor: token.colorBgMask,
              zIndex: token.zIndexPopupBase,
              borderRadius: token.borderRadius,
            }}
          >
            <Button
              icon={<EyeOutlined style={{ color: token.colorWhite }} />}
              variant="link"
              color="default"
              size="small"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </>
      )}
    </div>
  );
};

export const FileMessage: React.FC<FileMessageProps> = ({
  value,
  urlProxyUrl,
  urlRoot,
  options,
}) => {
  const { imageProps } = options;
  return (
    <Flex
      gap="small"
      wrap
      {...options}
      className="ms-gr-pro-chatbot-message-file-message"
    >
      {value?.map((file, index) => {
        const item = resolveItem(file, urlRoot, urlProxyUrl);

        return (
          <FileContainer key={`${item.uid}-${index}`} item={item}>
            <FileCard
              item={item as typeof file}
              urlRoot={urlRoot}
              urlProxyUrl={urlProxyUrl}
              imageProps={imageProps}
            />
          </FileContainer>
        );
      })}
    </Flex>
  );
};
