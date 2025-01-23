import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Collapse as ACollapse, type GetProps } from 'antd';

import { useItems, withItemsContextProvider } from './context';

type CollapseProps = GetProps<typeof ACollapse>;
export const Collapse = sveltify<
  CollapseProps & {
    setSlotParams: SetSlotParams;
  },
  ['expandIcon']
>(
  withItemsContextProvider(
    ['default', 'items'],
    ({
      slots,
      items,
      children,
      onChange,
      setSlotParams,
      expandIcon,
      ...props
    }) => {
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
      const expandIconFunction = useFunction(expandIcon);
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
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
                  resolvedSlotItems,
                  {
                    // for the children slot
                    // clone: true,
                  }
                )
              );
            }, [items, resolvedSlotItems])}
          />
        </>
      );
    }
  )
);

export default Collapse;
