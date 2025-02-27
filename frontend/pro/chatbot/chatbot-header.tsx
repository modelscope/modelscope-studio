import type React from 'react';
import { Markdown } from '@globals/components';

import type { ChatbotMarkdownConfig } from './type';

export interface ChatbotHeaderProps {
  markdownConfig: ChatbotMarkdownConfig;
  title?: string;
}

export const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({
  markdownConfig,
  title,
}) => {
  if (!title) {
    return null;
  }
  if (!markdownConfig.renderMarkdown) {
    return <>{title}</>;
  }
  return <Markdown {...markdownConfig} value={title} />;
};
