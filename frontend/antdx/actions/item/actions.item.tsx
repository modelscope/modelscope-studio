import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Actions, type ActionsItemProps } from '@ant-design/x';

export const ActionsItem = sveltify<
  Partial<ActionsItemProps>,
  ['defaultIcon', 'runningIcon']
>(({ slots, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <Actions.Item
        {...props}
        defaultIcon={
          slots.defaultIcon ? (
            <ReactSlot slot={slots.defaultIcon} clone />
          ) : (
            props.defaultIcon
          )
        }
        runningIcon={
          slots.runningIcon ? (
            <ReactSlot slot={slots.runningIcon} clone />
          ) : (
            props.runningIcon
          )
        }
      />
    </>
  );
});

export default ActionsItem;
