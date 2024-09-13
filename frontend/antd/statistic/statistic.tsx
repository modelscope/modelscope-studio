import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Statistic as AStatistic } from 'antd';

export const Statistic = sveltify<
  GetProps<typeof AStatistic> & {
    children: React.ReactNode;
  },
  ['prefix', 'suffix', 'title']
>(({ children, slots, formatter, ...props }) => {
  const formatterFunction = useFunction(formatter);
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <AStatistic
        {...props}
        formatter={formatterFunction}
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        prefix={slots.prefix ? <ReactSlot slot={slots.prefix} /> : props.prefix}
        suffix={slots.suffix ? <ReactSlot slot={slots.suffix} /> : props.suffix}
      />
    </>
  );
});

export default Statistic;
