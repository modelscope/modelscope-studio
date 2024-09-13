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
      <AFloatButton
        {...props}
        icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
        description={
          slots.description ? (
            <ReactSlot slot={slots.description} />
          ) : (
            props.description
          )
        }
        tooltip={
          slots.tooltip ? <ReactSlot slot={slots.tooltip} /> : props.tooltip
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
      {/* render the slots */}
      {children}
    </>
  );
});

export default FloatButton;
