import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Badge as ABadge, type GetProps } from 'antd';

export const Badge = sveltify<GetProps<typeof ABadge>, ['count', 'text']>(
  ({ slots, ...props }) => {
    return (
      <>
        <ABadge
          {...props}
          count={slots.count ? <ReactSlot slot={slots.count} /> : props.count}
          text={slots.text ? <ReactSlot slot={slots.text} /> : props.text}
        />
      </>
    );
  }
);

export default Badge;
