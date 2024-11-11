import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { type GetProps, Space as ASpace } from 'antd';

export const Space = sveltify<GetProps<typeof ASpace>, ['split']>(
  ({ slots, children, ...props }) => {
    const targets = useTargets(children);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ASpace
          {...props}
          split={
            slots.split ? <ReactSlot slot={slots.split} clone /> : props.split
          }
        >
          {targets.map((target, index) => {
            return <ReactSlot slot={target} key={index} />;
          })}
        </ASpace>
      </>
    );
  }
);

export default Space;
