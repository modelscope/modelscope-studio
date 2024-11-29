import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Collapse as ACollapse, type GetProps } from 'antd';

import { type Item } from './context';

type CollapseProps = GetProps<typeof ACollapse>;
export const Collapse = sveltify<
  CollapseProps & {
    slotItems: Item[];
    setSlotParams: SetSlotParams;
  },
  ['expandIcon']
>(
  ({
    slots,
    items,
    slotItems,
    children,
    onChange,
    setSlotParams,
    expandIcon,
    ...props
  }) => {
    const expandIconFunction = useFunction(expandIcon);
    return (
      <>
        {children}
        <ACollapse
          {...props}
          onChange={(key) => {
            onChange?.(key);
          }}
          expandIcon={
            slots.expandIcon
              ? renderParamsSlot({ slots, setSlotParams, key: 'expandIcon' })
              : expandIconFunction
          }
          items={useMemo(() => {
            // ['label','extra', 'children']
            return (
              items ||
              renderItems<NonNullable<CollapseProps['items']>[number]>(
                slotItems,
                { clone: true }
              )
            );
          }, [items, slotItems])}
        />
      </>
    );
  }
);

export default Collapse;
