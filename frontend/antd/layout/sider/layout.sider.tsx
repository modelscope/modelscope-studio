import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { type GetProps, Layout as ALayout } from 'antd';

export const LayoutSider = sveltify<
  GetProps<typeof ALayout.Sider>,
  ['trigger']
>(({ slots, ...props }) => {
  return (
    <ALayout.Sider
      {...props}
      trigger={
        slots.trigger ? (
          <ReactSlot slot={slots.trigger} clone />
        ) : props.trigger === undefined ? null : props.trigger ===
          'default' ? undefined : (
          props.trigger
        )
      }
    />
  );
});

export default LayoutSider;
