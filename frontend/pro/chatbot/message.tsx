import type React from 'react';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { Input } from 'antd';

import { FileMessage } from './messages/file';
import { SuggestionMessage } from './messages/suggestion';
import { TextMessage } from './messages/text';
import { ThoughtMessage } from './messages/thought';
import type {
  ChatbotFileContent,
  ChatbotFileContentConfig,
  ChatbotMarkdownConfig,
  ChatbotMessage,
  ChatbotSuggestionContent,
  ChatbotSuggestionContentConfig,
  ChatbotTextContent,
  ChatbotTextContentConfig,
  ChatbotThoughtContent,
  ChatbotThoughtContentConfig,
  SuggestionData,
} from './type';
import { convertObjectKeyToCamelCase, getContextText } from './utils';

export interface MessageProps {
  index: number;
  getContainerRef: (div: HTMLDivElement, message: ChatbotMessage) => void;
  isEditing: boolean;
  markdownConfig: ChatbotMarkdownConfig;
  message: ChatbotMessage;
  urlRoot: string;
  urlProxyUrl: string;
  onEdit: (value: string) => void;
  onSuggestionSelect: (value: SuggestionData) => void;
}

export const Message: React.FC<MessageProps> = ({
  isEditing,
  index,
  getContainerRef,
  message,
  markdownConfig,
  onEdit,
  onSuggestionSelect,
  urlProxyUrl,
  urlRoot,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const text = useMemo(
    () =>
      getContextText(message.content, {
        fallback: (v) => JSON.stringify(v, null, 2),
      }),
    [message.content]
  );
  const getContainerRefMemoized = useMemoizedFn(getContainerRef);
  useLayoutEffect(() => {
    if (isEditing && containerRef.current) {
      getContainerRefMemoized(containerRef.current, message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, getContainerRefMemoized]);

  const renderContent = () => {
    if (isEditing) {
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
              onEdit(e.target.value);
            }}
          />
        </div>
      );
    }
    switch (message.type) {
      case 'text':
        return (
          <TextMessage
            value={message.content as ChatbotTextContent}
            options={{
              ...markdownConfig,
              ...(convertObjectKeyToCamelCase(
                message.content_options
              ) as ChatbotTextContentConfig),
            }}
          />
        );
      case 'thought':
        return (
          <ThoughtMessage
            value={message.content as ChatbotThoughtContent}
            options={{
              ...markdownConfig,
              ...(convertObjectKeyToCamelCase(
                message.content_options
              ) as ChatbotThoughtContentConfig),
            }}
          />
        );
      case 'file':
        return (
          <FileMessage
            value={message.content as ChatbotFileContent}
            urlRoot={urlRoot}
            urlProxyUrl={urlProxyUrl}
            options={
              (message.content_options || {}) as ChatbotFileContentConfig
            }
          />
        );
      case 'suggestion':
        return (
          <SuggestionMessage
            value={message.content as ChatbotSuggestionContent}
            options={
              (message.content_options || {}) as ChatbotSuggestionContentConfig
            }
            onItemClick={(v) => {
              onSuggestionSelect({
                index,
                value: v,
              });
            }}
          />
        );
      default:
        if (typeof message.content !== 'string') {
          return null;
        }
        return (
          <TextMessage
            value={message.content as ChatbotTextContent}
            options={{
              ...markdownConfig,
              ...(convertObjectKeyToCamelCase(
                message.content_options
              ) as ChatbotTextContentConfig),
            }}
          />
        );
    }
  };
  return <div ref={containerRef}>{renderContent()}</div>;
};
