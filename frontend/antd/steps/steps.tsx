import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Steps as ASteps } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const Steps = sveltify<
  GetProps<typeof ASteps> & {
    children?: React.ReactNode;
  },
  ['progressDot']
>(
  withItemsContextProvider(
    ['items', 'default'],
    ({ slots, items, children, progressDot, ...props }) => {
      const { items: slotItems } = useItems<['items', 'default']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
      const progressDotFunction = useFunction(progressDot);
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <ASteps
            {...props}
            items={useMemo(() => {
              return (
                items ||
                renderItems<
                  NonNullable<GetProps<typeof ASteps>['items']>[number]
                >(resolvedSlotItems)
              );
            }, [items, resolvedSlotItems])}
            progressDot={
              slots.progressDot
                ? renderParamsSlot(
                    { slots, key: 'progressDot' },
                    { clone: true }
                  )
                : progressDotFunction || progressDot
            }
          />
        </>
      );
    }
  )
);

export default Steps;
