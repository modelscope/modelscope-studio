import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Menu as AMenu } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';

import { type Item } from './context';

import './menu.less';

export const Menu = sveltify<
  GetProps<typeof AMenu> & {
    slotItems: Item[];
    setSlotParams: SetSlotParams;
  },
  ['expandIcon', 'overflowedIndicator']
>(
  ({
    slots,
    items,
    slotItems,
    children,
    onOpenChange,
    onSelect,
    onDeselect,
    setSlotParams,
    ...props
  }) => {
    return (
      <>
        {children}
        <AMenu
          {...omitUndefinedProps(props)}
          onOpenChange={(openKeys) => {
            onOpenChange?.(openKeys);
          }}
          onSelect={(e) => {
            onSelect?.(e);
          }}
          onDeselect={(e) => {
            onDeselect?.(e);
          }}
          items={useMemo(() => {
            // ['label','icon',"title"]
            return items || renderItems<ItemType>(slotItems);
          }, [items, slotItems])}
          expandIcon={
            slots.expandIcon
              ? renderParamsSlot(
                  {
                    key: 'expandIcon',
                    slots,
                    setSlotParams,
                  },
                  { clone: true }
                )
              : props.expandIcon
          }
          overflowedIndicator={
            slots.overflowedIndicator ? (
              <ReactSlot slot={slots.overflowedIndicator} />
            ) : (
              props.overflowedIndicator
            )
          }
        />
      </>
    );
  }
);

export default Menu;
