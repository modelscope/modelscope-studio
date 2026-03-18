import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import {
  ThoughtChain as XThoughtChain,
  type ThoughtChainItemProps,
} from '@ant-design/x';

export const ThoughtChainItem = sveltify<
  ThoughtChainItemProps,
  ['description', 'icon', 'title']
>(({ children, slots, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <XThoughtChain.Item
        {...props}
        description={
          slots.description ? (
            <ReactSlot slot={slots.description} />
          ) : (
            props.description
          )
        }
        icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
      />
    </>
  );
});

export default ThoughtChainItem;
