import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import {
  CodeHighlighter as XCodeHighlighter,
  type CodeHighlighterProps,
} from '@ant-design/x';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import {
  materialDark,
  materialLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

const customDarkStyle = {
  ...materialDark,
  'pre[class*="language-"]': {
    ...materialDark['pre[class*="language-"]'],
    margin: 0,
  },
};

const customLightStyle = {
  ...materialLight,
  'pre[class*="language-"]': {
    ...materialLight['pre[class*="language-"]'],
    margin: 0,
  },
};

export const CodeHighlighter = sveltify<
  CodeHighlighterProps & {
    value?: string;
    themeMode: string;
  },
  ['header']
>(({ slots, children, value, themeMode, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <XCodeHighlighter
        {...props}
        highlightProps={{
          style: themeMode === 'dark' ? customDarkStyle : customLightStyle,
          ...props.highlightProps,
        }}
        header={slots.header ? <ReactSlot slot={slots.header} /> : props.header}
      >
        {value || ''}
      </XCodeHighlighter>
    </>
  );
});

export default CodeHighlighter;
