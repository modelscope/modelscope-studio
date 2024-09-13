import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { FloatButton as AFloatButton, type GetProps } from 'antd';

export const FloatButtonBackTop = sveltify<
  GetProps<typeof AFloatButton.BackTop>,
  ['icon', 'description', 'tooltip', 'badge.count']
>(({ slots, children, target, ...props }) => {
  const targetFunction = useFunction(target);
  return (
    <>
      <AFloatButton.BackTop
        {...props}
        target={targetFunction}
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
      {children}
    </>
  );
});

export default FloatButtonBackTop;
