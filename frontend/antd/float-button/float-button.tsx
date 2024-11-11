import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { FloatButton as AFloatButton, type GetProps } from 'antd';

export const FloatButton = sveltify<
  GetProps<typeof AFloatButton> & {
    id?: string;
  },
  ['icon', 'description', 'tooltip', 'badge.count']
>(({ slots, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <AFloatButton
        {...props}
        icon={slots.icon ? <ReactSlot clone slot={slots.icon} /> : props.icon}
        description={
          slots.description ? (
            <ReactSlot clone slot={slots.description} />
          ) : (
            props.description
          )
        }
        tooltip={
          slots.tooltip ? (
            <ReactSlot clone slot={slots.tooltip} />
          ) : (
            props.tooltip
          )
        }
        badge={{
          ...props.badge,
          count: slots['badge.count'] ? (
            <ReactSlot slot={slots['badge.count']} />
          ) : (
            props.badge?.count
          ),
        }}
      />
    </>
  );
});

export default FloatButton;
