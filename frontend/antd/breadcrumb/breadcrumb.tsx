import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Breadcrumb as ABreadcrumb, type GetProps } from 'antd';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';

import { type Item } from './context';

export const Breadcrumb = sveltify<
  GetProps<typeof ABreadcrumb> & {
    slotItems: Item[];
    setSlotParams: SetSlotParams;
  },
  ['separator', 'itemRender']
>(({ slots, items, slotItems, setSlotParams, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <ABreadcrumb
        {...props}
        itemRender={
          slots['itemRender']
            ? renderParamsSlot(
                {
                  setSlotParams,
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
            renderItems<ItemType>(slotItems, {
              clone: true,
            })
          );
        }, [items, slotItems])}
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
});

export default Breadcrumb;
