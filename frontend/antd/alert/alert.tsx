import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { Alert as AAlert, type GetProps } from 'antd';

export const Alert = sveltify<
  GetProps<typeof AAlert>,
  ['action', 'closable.closeIcon', 'description', 'icon', 'message']
>(({ slots, afterClose, ...props }) => {
  const afterCloseFunction = useFunction(afterClose);
  return (
    <AAlert
      {...props}
      afterClose={afterCloseFunction}
      action={slots.action ? <ReactSlot slot={slots.action} /> : props.action}
      closable={
        slots['closable.closeIcon']
          ? {
              ...(typeof props.closable === 'object' ? props.closable : {}),
              closeIcon: <ReactSlot slot={slots['closable.closeIcon']} />,
            }
          : props.closable
      }
      description={
        slots.description ? (
          <ReactSlot slot={slots.description} />
        ) : (
          props.description
        )
      }
      icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
      message={
        slots.message ? <ReactSlot slot={slots.message} /> : props.message
      }
    />
  );
});

export default Alert;
