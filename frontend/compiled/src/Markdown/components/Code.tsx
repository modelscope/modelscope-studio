import React, { useState } from 'react';
import type { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import cls from 'classnames';

import { useMarkdownContext } from '../context';

const CopyButton: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const feedback = () => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(value);
      feedback();
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = value;

      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        feedback();
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }
  };
  return copied ? <CheckOutlined /> : <CopyOutlined onClick={onCopy} />;
};

export const Code: Components['code'] = ({ children, className, ...props }) => {
  const { theme } = useMarkdownContext();
  const match = /language-(\w+)/.exec(className || '');
  const matchLang = match && match[1] ? match[1].toLowerCase() : '';
  const childrenArray = React.Children.toArray(children);
  const isCodeString =
    childrenArray.length === 1 && typeof childrenArray[0] === 'string';
  if ((props as any).inline || !isCodeString) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }
  const code = String(children).replace(/\n$/, '');
  return (
    <div
      className={cls(
        'ms-markdown-code',
        theme === 'dark' && 'ms-markdown-code-dark'
      )}
    >
      <div
        className="ms-markdown-code-header"
        style={{
          borderTopLeftRadius: '0.3em',
          borderTopRightRadius: '0.3em',
        }}
      >
        <span className="ms-markdown-code-header-lang">
          {matchLang || 'code'}
        </span>
        <span className="ms-markdown-code-header-copy">
          <CopyButton value={code} />
        </span>
      </div>
      <SyntaxHighlighter
        customStyle={{
          borderRadius: 0,
          borderBottomLeftRadius: '0.3em',
          borderBottomRightRadius: '0.3em',
          width: '100%',
          marginTop: 0,
          overflow: 'auto',
        }}
        language={matchLang}
        showLineNumbers={false}
        PreTag="div"
        style={theme === 'dark' ? oneDark : oneLight}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
