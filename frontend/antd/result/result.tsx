import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { type GetProps, Result as AResult } from 'antd';

export const Result = sveltify<
  GetProps<typeof AResult>,
  ['extra', 'icon', 'subTitle', 'title']
>(({ slots, children, ...props }) => {
  const targets = useTargets(children);
  return (
    <>
      <div style={{ display: 'none' }}>
        {targets.length > 0 ? null : children}
      </div>
      <AResult
        {...props}
        extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
        icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
        subTitle={
          slots.subTitle ? <ReactSlot slot={slots.subTitle} /> : props.subTitle
        }
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
      >
        {targets.length > 0 ? children : null}
      </AResult>
    </>
  );
});

export default Result;
