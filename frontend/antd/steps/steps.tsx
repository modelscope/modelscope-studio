import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Steps as ASteps } from 'antd';

import { type Item } from './context';

export const Steps = sveltify<
  GetProps<typeof ASteps> & {
    slotItems: Item[];
    setSlotParams: SetSlotParams;
  },
  ['progressDot']
>(({ slots, items, slotItems, setSlotParams, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <ASteps
        {...props}
        items={useMemo(() => {
          return (
            items ||
            renderItems<NonNullable<GetProps<typeof ASteps>['items']>[number]>(
              slotItems
            )
          );
        }, [items, slotItems])}
        progressDot={
          slots.progressDot
            ? renderParamsSlot(
                { slots, setSlotParams, key: 'progressDot' },
                { clone: true }
              )
            : props.progressDot
        }
      />
    </>
  );
});

export default Steps;
