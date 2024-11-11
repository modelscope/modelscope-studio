import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Timeline as ATimeline } from 'antd';

import { type Item } from './context';

export const Timeline = sveltify<
  GetProps<typeof ATimeline> & {
    slotItems: Item[];
  },
  ['pending', 'pendingDot']
>(({ slots, items, slotItems, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <ATimeline
        {...props}
        items={useMemo(() => {
          return (
            items ||
            renderItems<
              NonNullable<GetProps<typeof ATimeline>['items']>[number]
            >(slotItems)
          );
        }, [items, slotItems])}
        pending={
          slots.pending ? <ReactSlot slot={slots.pending} /> : props.pending
        }
        pendingDot={
          slots.pendingDot ? (
            <ReactSlot slot={slots.pendingDot} />
          ) : (
            props.pendingDot
          )
        }
      />
    </>
  );
});

export default Timeline;
