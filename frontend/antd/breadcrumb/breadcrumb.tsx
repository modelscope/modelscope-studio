import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { Breadcrumb as ABreadcrumb, type GetProps } from 'antd';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';

import { type Item } from './context';

export const Breadcrumb = sveltify<
  GetProps<typeof ABreadcrumb> & {
    slotItems: Item[];
  },
  ['separator']
>(({ slots, items, slotItems, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <ABreadcrumb
        {...props}
        items={useMemo(() => {
          return items || renderItems<ItemType>(slotItems);
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
