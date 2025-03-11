import type React from 'react';
import { Prompts } from '@ant-design/x';
import cls from 'classnames';

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
  const { elem_style, elem_classes, class_names, styles, ...props } = options;

  return (
    <Prompts
      {...props}
      classNames={class_names}
      className={cls(elem_classes)}
      style={elem_style}
      styles={styles}
      items={value}
      onItemClick={({ data }) => {
        onItemClick(data);
      }}
    />
  );
};
