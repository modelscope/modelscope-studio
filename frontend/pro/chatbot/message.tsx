import React, { useLayoutEffect, useRef } from 'react';
import { convertObjectKeyToCamelCase } from '@utils/convertToCamelCase';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { Flex, Input } from 'antd';

import { FileMessage } from './messages/file';
import { SuggestionMessage } from './messages/suggestion';
import { TextMessage } from './messages/text';
import { ToolMessage } from './messages/tool';
import type {
  ChatbotFileContent,
  ChatbotFileContentConfig,
  ChatbotMarkdownConfig,
  ChatbotMessage,
  ChatbotSuggestionContent,
  ChatbotSuggestionContentConfig,
  ChatbotTextContent,
  ChatbotTextContentConfig,
  ChatbotToolContent,
  ChatbotToolContentConfig,
  SuggestionData,
} from './type';
import { normalizeMessageContent, walkSuggestionContent } from './utils';

export interface MessageProps {
  index: number;
  getContainerRef: (div: HTMLDivElement, message: ChatbotMessage) => void;
  isEditing: boolean;
  isLastMessage: boolean;
  markdownConfig: ChatbotMarkdownConfig;
  message: ChatbotMessage;
  urlRoot: string;
  urlProxyUrl: string;
  onEdit: (itemIndex: number, value: string) => void;
  onSuggestionSelect: (value: SuggestionData) => void;
}

export const Message: React.FC<MessageProps> = ({
  isEditing,
  index,
  getContainerRef,
  message,
  isLastMessage,
  markdownConfig,
  onEdit,
  onSuggestionSelect,
  urlProxyUrl,
  urlRoot,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getContainerRefMemoized = useMemoizedFn(getContainerRef);
  useLayoutEffect(() => {
    if (isEditing && containerRef.current) {
      getContainerRefMemoized(containerRef.current, message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, getContainerRefMemoized]);

  const renderContent = () => {
    const content = normalizeMessageContent(message.content);
    return content.map((item, i) => {
      const render = () => {
        if (isEditing && ['text', 'tool'].includes(item.type)) {
          const text = item.content as ChatbotTextContent | ChatbotToolContent;
          const containerWidth =
            containerRef.current?.getBoundingClientRect().width;
          return (
            <div
              style={{
                width: containerWidth,
                minWidth: 200,
                maxWidth: '100%',
              }}
            >
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                defaultValue={text}
                onChange={(e) => {
                  onEdit(i, e.target.value);
                }}
              />
            </div>
          );
        }
        switch (item.type) {
          case 'text':
            return (
              <TextMessage
                value={item.content as ChatbotTextContent}
                options={omitUndefinedProps(
                  {
                    ...markdownConfig,
                    ...(convertObjectKeyToCamelCase(
                      item.options
                    ) as ChatbotTextContentConfig),
                  },
                  { omitNull: true }
                )}
              />
            );
          case 'tool':
            return (
              <ToolMessage
                value={item.content as ChatbotToolContent}
                options={omitUndefinedProps(
                  {
                    ...markdownConfig,
                    ...(convertObjectKeyToCamelCase(
                      item.options
                    ) as ChatbotToolContentConfig),
                  },
                  { omitNull: true }
                )}
              />
            );
          case 'file':
            return (
              <FileMessage
                value={item.content as ChatbotFileContent}
                urlRoot={urlRoot}
                urlProxyUrl={urlProxyUrl}
                options={omitUndefinedProps(
                  (item.options || {}) as ChatbotFileContentConfig,
                  { omitNull: true }
                )}
              />
            );
          case 'suggestion':
            return (
              <SuggestionMessage
                value={
                  isLastMessage
                    ? item.content
                    : walkSuggestionContent(
                        item.content as ChatbotSuggestionContent,
                        (v) => {
                          return {
                            ...v,
                            disabled: v.disabled ?? true,
                          };
                        }
                      )
                }
                options={omitUndefinedProps(
                  (item.options || {}) as ChatbotSuggestionContentConfig,
                  { omitNull: true }
                )}
                onItemClick={(v) => {
                  onSuggestionSelect({
                    index,
                    value: v,
                  });
                }}
              />
            );
          default:
            if (typeof item.content !== 'string') {
              return null;
            }
            return (
              <TextMessage
                value={item.content as ChatbotTextContent}
                options={omitUndefinedProps(
                  {
                    ...markdownConfig,
                    ...(convertObjectKeyToCamelCase(
                      item.options
                    ) as ChatbotTextContentConfig),
                  },
                  { omitNull: true }
                )}
              />
            );
        }
      };
      return <React.Fragment key={i}>{render()}</React.Fragment>;
    });
  };
  return (
    <div ref={containerRef}>
      <Flex vertical gap="small">
        {renderContent()}
      </Flex>
    </div>
  );
};
