import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { type GetProps, Spin as ASpin } from 'antd';

export const Spin = sveltify<
  GetProps<typeof ASpin> & {
    id?: string;
  },
  ['tip', 'indicator']
>(({ slots, ...props }) => {
  return (
    <ASpin
      {...props}
      tip={slots.tip ? <ReactSlot slot={slots.tip} /> : props.tip}
      indicator={
        slots.indicator ? <ReactSlot slot={slots.indicator} /> : props.indicator
      }
    />
  );
});

export default Spin;
