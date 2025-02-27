import type React from 'react';
import { Prompts } from '@ant-design/x';

import type {
  ChatbotSuggestionContent,
  ChatbotSuggestionContentConfig,
} from '../type';

export interface SuggestionMessageProps {
  options: ChatbotSuggestionContentConfig;
  value?: ChatbotSuggestionContent;
  onItemClick: (value: ChatbotSuggestionContent[number]) => void;
}

export const SuggestionMessage: React.FC<SuggestionMessageProps> = ({
  value,
  options,
  onItemClick,
}) => {
  return (
    <Prompts
      {...options}
      items={value}
      onItemClick={({ data }) => {
        onItemClick(data);
      }}
    />
  );
};
