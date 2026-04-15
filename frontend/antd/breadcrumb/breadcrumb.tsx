import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Breadcrumb as ABreadcrumb, type GetProps } from 'antd';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';

import { useItems, withItemsContextProvider } from './context';

export const Breadcrumb = sveltify<
  GetProps<typeof ABreadcrumb>,
  ['separator', 'itemRender', 'dropdownIcon']
>(
  withItemsContextProvider(
    ['default', 'items'],
    ({ slots, items, children, ...props }) => {
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <ABreadcrumb
            {...props}
            dropdownIcon={
              slots.dropdownIcon ? (
                <ReactSlot slot={slots.dropdownIcon} clone />
              ) : (
                props.dropdownIcon
              )
            }
            itemRender={
              slots['itemRender']
                ? renderParamsSlot(
                    {
                      slots,
                      key: 'itemRender',
                    },
                    { clone: true }
                  )
                : props.itemRender
            }
            items={useMemo(() => {
              return (
                items ||
                renderItems<ItemType>(resolvedSlotItems, {
                  // clone: true,
                })
              );
            }, [items, resolvedSlotItems])}
            separator={
              slots.separator ? (
                <ReactSlot slot={slots.separator} clone />
              ) : (
                props.separator
              )
            }
          />
        </>
      );
    }
  )
);

export default Breadcrumb;
