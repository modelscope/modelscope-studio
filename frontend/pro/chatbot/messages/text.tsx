import type React from 'react';
import { Markdown } from '@globals/components';

import type { ChatbotTextContent, ChatbotTextContentConfig } from '../type';

export interface TextMessageProps {
  options: ChatbotTextContentConfig;
  value?: ChatbotTextContent;
}

export const TextMessage: React.FC<TextMessageProps> = ({ value, options }) => {
  const { renderMarkdown, ...markdownProps } = options;
  return (
    <>
      {renderMarkdown ? <Markdown {...markdownProps} value={value} /> : value}
    </>
  );
};
