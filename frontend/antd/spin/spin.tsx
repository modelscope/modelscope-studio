import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { type GetProps, Spin as ASpin } from 'antd';

export const Spin = sveltify<
  GetProps<typeof ASpin> & {
    id?: string;
  },
  ['tip', 'indicator']
>(({ slots, children, ...props }) => {
  const targets = useTargets(children);

  return (
    <>
      <div style={{ display: 'none' }}>
        {targets.length === 0 ? children : null}
      </div>
      <ASpin
        {...props}
        tip={slots.tip ? <ReactSlot slot={slots.tip} /> : props.tip}
        indicator={
          slots.indicator ? (
            <ReactSlot slot={slots.indicator} />
          ) : (
            props.indicator
          )
        }
      >
        {targets.length === 0 ? undefined : children}
      </ASpin>
    </>
  );
});

export default Spin;
