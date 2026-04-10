import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Masonry as AMasonry, type MasonryProps } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const Masonry = sveltify<
  MasonryProps & {
    children?: React.ReactNode;
  },
  ['itemRender']
>(
  withItemsContextProvider(
    ['default', 'items'],
    ({ children, slots, items, ...props }) => {
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
      const itemRenderFunction = useFunction(props.itemRender);
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <AMasonry
            {...props}
            itemRender={
              slots.itemRender
                ? renderParamsSlot({
                    slots,
                    key: 'itemRender',
                  })
                : itemRenderFunction
            }
            items={useMemo(() => {
              return (
                items ||
                renderItems<NonNullable<MasonryProps['items']>[number]>(
                  resolvedSlotItems
                )
              );
            }, [items, resolvedSlotItems])}
          />
        </>
      );
    }
  )
);

export default Masonry;
