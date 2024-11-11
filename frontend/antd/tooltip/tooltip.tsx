import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Tooltip as ATooltip } from 'antd';

export const Tooltip = sveltify<GetProps<typeof ATooltip>, ['title']>(
  ({ slots, afterOpenChange, getPopupContainer, children, ...props }) => {
    const afterOpenChangeFunction = useFunction(afterOpenChange);
    const getPopupContainerFunction = useFunction(getPopupContainer);
    return (
      <>
        <ATooltip
          {...props}
          afterOpenChange={afterOpenChangeFunction}
          getPopupContainer={getPopupContainerFunction}
          title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        >
          {children}
        </ATooltip>
      </>
    );
  }
);

export default Tooltip;
