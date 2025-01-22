import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Timeline as ATimeline } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const Timeline = sveltify<
  GetProps<typeof ATimeline>,
  ['pending', 'pendingDot']
>(
  withItemsContextProvider(
    ['items', 'default'],
    ({ slots, items, children, ...props }) => {
      const { items: slotItems } = useItems<['items', 'default']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
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
                >(resolvedSlotItems)
              );
            }, [items, resolvedSlotItems])}
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
    }
  )
);

export default Timeline;
