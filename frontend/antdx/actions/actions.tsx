import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { Actions as XActions, type ActionsProps } from '@ant-design/x';
import type { ItemType } from '@ant-design/x/es/actions/interface';
import { createFunction } from '@utils/createFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { renderSlot } from '@utils/renderSlot';

import {
  useItems as useMenuItems,
  withItemsContextProvider as withMenuItemsContextProvider,
} from '../../antd/menu/context';

import { useItems, withItemsContextProvider } from './context';

export const Actions = sveltify<
  Partial<ActionsProps>,
  [
    'dropdownProps.dropdownRender',
    'dropdownProps.popupRender',
    'dropdownProps.menu.expandIcon',
    'dropdownProps.menu.overflowedIndicator',
    'dropdownProps.menu.items',
  ]
>(
  withMenuItemsContextProvider(
    ['dropdownProps.menu.items'],
    withItemsContextProvider(
      ['default', 'items'],
      ({ children, items, dropdownProps, slots, ...props }) => {
        const { items: slotItems } = useItems<['default', 'items']>();
        const resolvedSlotItems =
          slotItems.items.length > 0 ? slotItems.items : slotItems.default;
        const {
          items: { 'dropdownProps.menu.items': dropdownMenuItems },
        } = useMenuItems<['dropdownProps.menu.items']>();

        const modifiedDropdownProps = useMemo(() => {
          const dropdownMenu = {
            ...(dropdownProps?.menu || {}),
            items:
              dropdownProps?.menu?.items || dropdownMenuItems?.length > 0
                ? renderItems(dropdownMenuItems, {
                    clone: true,
                  })
                : undefined,
            expandIcon:
              renderParamsSlot(
                {
                  slots: slots,
                  key: 'dropdownProps.menu.expandIcon',
                },
                {
                  clone: true,
                }
              ) || dropdownProps?.menu?.expandIcon,
            overflowedIndicator:
              renderSlot(slots['dropdownProps.menu.overflowedIndicator']) ||
              dropdownProps?.menu?.overflowedIndicator,
          };

          const modifiedProps = {
            ...(dropdownProps || {}),
            dropdownRender: slots['dropdownProps.dropdownRender']
              ? renderParamsSlot(
                  {
                    slots: slots,
                    key: 'dropdownProps.dropdownRender',
                  },
                  {
                    clone: true,
                  }
                )
              : createFunction(dropdownProps?.dropdownRender),
            popupRender: slots['dropdownProps.popupRender']
              ? renderParamsSlot(
                  {
                    slots: slots,
                    key: 'dropdownProps.popupRender',
                  },
                  {
                    clone: true,
                  }
                )
              : createFunction(dropdownProps?.popupRender),
            menu:
              Object.values(dropdownMenu).filter(Boolean).length > 0
                ? dropdownMenu
                : undefined,
          } as NonNullable<typeof dropdownProps>;

          return Object.values(modifiedProps).filter(Boolean).length > 0
            ? dropdownProps
            : undefined;
        }, [dropdownMenuItems, dropdownProps, slots]);

        return (
          <>
            <div style={{ display: 'none' }}>{children}</div>
            <XActions
              {...props}
              dropdownProps={modifiedDropdownProps}
              items={useMemo(() => {
                return (
                  items ||
                  renderItems<ItemType>(resolvedSlotItems, {
                    clone: true,
                    children: 'subItems',
                  }) ||
                  []
                );
              }, [items, resolvedSlotItems])}
            />
          </>
        );
      }
    )
  )
);

export default Actions;
