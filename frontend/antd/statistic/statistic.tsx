import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Statistic as AStatistic } from 'antd';

export const Statistic = sveltify<
  GetProps<typeof AStatistic> & {
    children: React.ReactNode;
    setSlotParams: SetSlotParams;
  },
  ['prefix', 'suffix', 'title', 'formatter']
>(({ children, slots, setSlotParams, formatter, ...props }) => {
  const formatterFunction = useFunction(formatter);
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <AStatistic
        {...props}
        formatter={
          slots.formatter
            ? renderParamsSlot({ slots, setSlotParams, key: 'formatter' })
            : formatterFunction
        }
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        prefix={slots.prefix ? <ReactSlot slot={slots.prefix} /> : props.prefix}
        suffix={slots.suffix ? <ReactSlot slot={slots.suffix} /> : props.suffix}
      />
    </>
  );
});

export default Statistic;
