import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Sender as XSender } from '@ant-design/x';
import { type SenderHeaderProps } from '@ant-design/x/es/sender/SenderHeader';

export const SenderHeader = sveltify<SenderHeaderProps, ['title']>(
  ({ slots, ...props }) => {
    return (
      <>
        <XSender.Header
          {...props}
          title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        />
      </>
    );
  }
);

export default SenderHeader;
