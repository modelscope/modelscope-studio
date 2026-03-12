import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Bubble as XBubble } from '@ant-design/x';
import type { DividerBubbleProps } from '@ant-design/x/es/bubble/interface';

export const BubbleDivider = sveltify<
  DividerBubbleProps & {
    children?: React.ReactNode;
  },
  ['content']
>(({ slots, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <XBubble.Divider
        {...props}
        content={
          slots.content ? <ReactSlot slot={slots.content} /> : props.content
        }
      />
    </>
  );
});

export default BubbleDivider;
