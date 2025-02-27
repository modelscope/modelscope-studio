import type React from 'react';
import { useEffect, useState } from 'react';
import { Markdown } from '@globals/components';
import { Collapse } from 'antd';

import type {
  ChatbotThoughtContent,
  ChatbotThoughtContentConfig,
} from '../type';

export interface ThoughtMessageProps {
  options: ChatbotThoughtContentConfig;
  value?: ChatbotThoughtContent;
}

export const ThoughtMessage: React.FC<ThoughtMessageProps> = ({
  value,
  options,
}) => {
  const { renderMarkdown, status, title, ...markdownProps } = options;
  const [collapsed, setCollapsed] = useState(() => status !== 'done');
  useEffect(() => {
    setCollapsed(status !== 'done');
  }, [status]);
  return (
    <>
      <Collapse
        activeKey={collapsed ? ['thought'] : []}
        onChange={() => {
          setCollapsed(!collapsed);
        }}
        items={[
          {
            key: 'thought',
            label: title,
            children: renderMarkdown ? (
              <Markdown {...markdownProps} value={value} />
            ) : (
              value
            ),
          },
        ]}
      />
    </>
  );
};
