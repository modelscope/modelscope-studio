import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useTargets } from '@utils/hooks/useTargets';
import { Carousel as ACarousel, type GetProps } from 'antd';

export const Carousel = sveltify<GetProps<typeof ACarousel>>(
  ({ afterChange, beforeChange, children, ...props }) => {
    const afterChangeFunction = useFunction(afterChange);
    const beforeChangeFunction = useFunction(beforeChange);
    const targets = useTargets(children);

    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ACarousel
          {...props}
          afterChange={afterChangeFunction}
          beforeChange={beforeChangeFunction}
        >
          {targets.map((target, index) => {
            return <ReactSlot clone slot={target} key={index} />;
          })}
        </ACarousel>
      </>
    );
  }
);

export default Carousel;
