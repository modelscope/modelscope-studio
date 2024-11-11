import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { type GetProps, Result as AResult } from 'antd';

export const Result = sveltify<
  GetProps<typeof AResult>,
  ['extra', 'icon', 'subTitle', 'title']
>(({ slots, ...props }) => {
  return (
    <AResult
      {...props}
      extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
      icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
      subTitle={
        slots.subTitle ? <ReactSlot slot={slots.subTitle} /> : props.subTitle
      }
      title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
    />
  );
});

export default Result;
