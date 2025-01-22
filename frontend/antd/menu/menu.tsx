import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Menu as AMenu } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';

import { useItems, withItemsContextProvider } from './context';

import './menu.less';

export const Menu = sveltify<
  GetProps<typeof AMenu> & {
    setSlotParams: SetSlotParams;
  },
  ['expandIcon', 'overflowedIndicator']
>(
  withItemsContextProvider(
    ['default', 'items'],
    ({
      slots,
      items,
      children,
      onOpenChange,
      onSelect,
      onDeselect,
      setSlotParams,
      ...props
    }) => {
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
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
              return (
                items ||
                renderItems<ItemType>(resolvedSlotItems, {
                  clone: true,
                })
              );
            }, [items, resolvedSlotItems])}
            expandIcon={
              slots.expandIcon
                ? renderParamsSlot(
                    {
                      key: 'expandIcon',
                      slots,
                      setSlotParams,
                    },
                    {
                      clone: true,
                    }
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
  )
);

export default Menu;
