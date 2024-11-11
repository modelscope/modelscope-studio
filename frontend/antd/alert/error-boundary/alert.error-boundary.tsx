import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Alert as AAlert, type GetProps } from 'antd';

export const AlertErrorBoundary = sveltify<
  GetProps<typeof AAlert.ErrorBoundary>,
  ['description', 'message']
>(({ slots, ...props }) => {
  return (
    <AAlert
      {...props}
      description={
        slots.description ? (
          <ReactSlot slot={slots.description} />
        ) : (
          props.description
        )
      }
      message={
        slots.message ? <ReactSlot slot={slots.message} /> : props.message
      }
    />
  );
});

export default AlertErrorBoundary;
