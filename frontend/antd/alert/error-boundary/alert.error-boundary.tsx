import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Alert as AAlert } from 'antd';

export const AlertErrorBoundary = sveltify<
  {
    message?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
  },
  ['description', 'message']
>(({ slots, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      {React.createElement(AAlert.ErrorBoundary as any, {
        ...props,
        description: slots.description ? (
          <ReactSlot slot={slots.description} />
        ) : (
          props.description
        ),
        message: slots.message ? (
          <ReactSlot slot={slots.message} />
        ) : (
          props.message
        ),
      })}
    </>
  );
});

export default AlertErrorBoundary;
