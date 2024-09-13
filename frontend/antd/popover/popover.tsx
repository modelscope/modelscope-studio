import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Popover as APopover } from 'antd';

export const Popover = sveltify<
  GetProps<typeof APopover>,
  ['title', 'content']
>(({ slots, afterOpenChange, getPopupContainer, children, ...props }) => {
  const afterOpenChangeFunction = useFunction(afterOpenChange);
  const getPopupContainerFunction = useFunction(getPopupContainer);
  return (
    <>
      <APopover
        {...props}
        afterOpenChange={afterOpenChangeFunction}
        getPopupContainer={getPopupContainerFunction}
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        content={
          slots.content ? <ReactSlot slot={slots.content} /> : props.content
        }
      >
        {children}
      </APopover>
    </>
  );
});

export default Popover;
