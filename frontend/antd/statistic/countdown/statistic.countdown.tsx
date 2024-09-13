import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { type GetProps, Statistic as AStatistic } from 'antd';

export const StatisticCountdown = sveltify<
  GetProps<typeof AStatistic.Countdown> & {
    children: React.ReactNode;
  },
  ['prefix', 'suffix', 'title']
>(({ children, value, slots, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <AStatistic.Countdown
        {...props}
        value={typeof value === 'number' ? value * 1000 : value}
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        prefix={slots.prefix ? <ReactSlot slot={slots.prefix} /> : props.prefix}
        suffix={slots.suffix ? <ReactSlot slot={slots.suffix} /> : props.suffix}
      />
    </>
  );
});

export default StatisticCountdown;
