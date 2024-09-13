import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Steps as ASteps } from 'antd';

import { type Item } from './context';

export const Steps = sveltify<
  GetProps<typeof ASteps> & {
    slotItems: Item[];
  },
  ['progressDot']
>(({ slots, items, slotItems, ...props }) => {
  return (
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
          ? (dot) =>
              slots.progressDot ? <ReactSlot slot={slots.progressDot} /> : dot
          : undefined
      }
    />
  );
});

export default Steps;
