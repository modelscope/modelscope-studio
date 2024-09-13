import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Menu as AMenu } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';

import { type Item } from './context';

export const Menu = sveltify<
  GetProps<typeof AMenu> & {
    slotItems: Item[];
    onValueChange: (options: {
      openKeys: string[];
      selectedKeys: string[];
    }) => void;
  },
  ['expandIcon', 'overflowedIndicator']
>(
  ({
    slots,
    items,
    slotItems,
    children,
    onValueChange,
    onOpenChange,
    onSelect,
    onDeselect,
    ...props
  }) => {
    return (
      <>
        {children}
        <AMenu
          {...omitUndefinedProps(props)}
          onOpenChange={(openKeys) => {
            onOpenChange?.(openKeys);
            onValueChange?.({
              openKeys,
              selectedKeys: props.selectedKeys || [],
            });
          }}
          onSelect={(e) => {
            onSelect?.(e);
            onValueChange?.({
              openKeys: props.openKeys || [],
              selectedKeys: e.selectedKeys,
            });
          }}
          onDeselect={(e) => {
            onDeselect?.(e);
            onValueChange?.({
              openKeys: props.openKeys || [],
              selectedKeys: e.selectedKeys,
            });
          }}
          items={useMemo(() => {
            // ['label','icon',"title"]
            return items || renderItems<ItemType>(slotItems);
          }, [items, slotItems])}
          expandIcon={
            slots.expandIcon ? (
              <ReactSlot slot={slots.expandIcon} clone />
            ) : (
              props.expandIcon
            )
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
