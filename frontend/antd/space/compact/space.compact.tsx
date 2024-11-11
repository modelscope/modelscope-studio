import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { type GetProps, Space as ASpace } from 'antd';

export const Space = sveltify<GetProps<typeof ASpace.Compact>>(
  ({ children, ...props }) => {
    const targets = useTargets(children);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ASpace.Compact {...props}>
          {targets.map((target, index) => {
            return <ReactSlot slot={target} key={index} />;
          })}
        </ASpace.Compact>
      </>
    );
  }
);

export default Space;
