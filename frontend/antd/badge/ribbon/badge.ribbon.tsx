import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Badge as ABadge, type GetProps } from 'antd';

export const BadgeRibbon = sveltify<GetProps<typeof ABadge.Ribbon>, ['text']>(
  ({ slots, children, ...props }) => {
    return (
      <>
        <ABadge.Ribbon
          {...props}
          text={slots.text ? <ReactSlot slot={slots.text} /> : props.text}
        >
          {children}
        </ABadge.Ribbon>
      </>
    );
  }
);

export default BadgeRibbon;
