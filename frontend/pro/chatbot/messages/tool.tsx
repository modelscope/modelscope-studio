import type React from 'react';
import { useEffect, useState } from 'react';
import { Markdown } from '@globals/components';
import { Collapse } from 'antd';

import type { ChatbotToolContent, ChatbotToolContentConfig } from '../type';

export interface ToolMessageProps {
  options: ChatbotToolContentConfig;
  value?: ChatbotToolContent;
}

export const ToolMessage: React.FC<ToolMessageProps> = ({ value, options }) => {
  const { renderMarkdown, status, title, ...markdownProps } = options;
  const [collapsed, setCollapsed] = useState(() => status !== 'done');
  useEffect(() => {
    setCollapsed(status !== 'done');
  }, [status]);
  return (
    <>
      <Collapse
        activeKey={collapsed ? ['tool'] : []}
        onChange={() => {
          setCollapsed(!collapsed);
        }}
        items={[
          {
            key: 'tool',
            label: renderMarkdown ? (
              <Markdown {...markdownProps} value={title} />
            ) : (
              title
            ),
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
