import type React from 'react';
import { useMemo } from 'react';
import { Prompts, Welcome } from '@ant-design/x';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { getFileUrl } from '@utils/upload';
import { Flex } from 'antd';
import cls from 'classnames';

import type { ChatbotWelcomeConfig, WelcomePromptData } from '../type';

export interface WelcomeMessageProps {
  options: ChatbotWelcomeConfig;
  rootUrl: string;
  apiPrefix: string;
  onWelcomePromptSelect: (value: WelcomePromptData) => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  options,
  apiPrefix,
  rootUrl,
  onWelcomePromptSelect,
}) => {
  const { prompts, ...welcome } = options;
  const resolvedPrompts = useMemo(() => {
    return omitUndefinedProps(prompts || {}, { omitNull: true });
  }, [prompts]);
  return (
    <Flex vertical gap="middle">
      <Welcome
        {...welcome}
        icon={getFileUrl(welcome.icon, rootUrl, apiPrefix)}
        styles={{
          ...welcome?.styles,
          icon: { flexShrink: 0, ...welcome?.styles?.icon },
        }}
        classNames={welcome.class_names}
        className={cls(welcome.elem_classes)}
        style={welcome.elem_style}
      />
      <Prompts
        {...resolvedPrompts}
        classNames={resolvedPrompts?.class_names}
        className={cls(resolvedPrompts?.elem_classes)}
        style={resolvedPrompts?.elem_style}
        onItemClick={({ data }) => {
          onWelcomePromptSelect({
            value: data,
          });
        }}
      />
    </Flex>
  );
};
