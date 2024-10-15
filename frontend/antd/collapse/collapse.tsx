import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Collapse as ACollapse, type GetProps } from 'antd';

import { type Item } from './context';

type CollapseProps = GetProps<typeof ACollapse>;
export const Collapse = sveltify<
  CollapseProps & {
    slotItems: Item[];
    onValueChange: CollapseProps['onChange'];
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
    onValueChange,
    setSlotParams,
    ...props
  }) => {
    return (
      <>
        {children}
        <ACollapse
          {...props}
          onChange={(key) => {
            onValueChange?.(key);
            onChange?.(key);
          }}
          expandIcon={
            slots.expandIcon
              ? renderParamsSlot({ slots, setSlotParams, key: 'expandIcon' })
              : props.expandIcon
          }
          items={useMemo(() => {
            // ['label','extra', 'children']
            return (
              items ||
              renderItems<NonNullable<CollapseProps['items']>[number]>(
                slotItems
              )
            );
          }, [items, slotItems])}
        />
      </>
    );
  }
);

export default Collapse;
