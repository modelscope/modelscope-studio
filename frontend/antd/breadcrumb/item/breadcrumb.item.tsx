import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React from 'react';
import { createFunction } from '@utils/createFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { renderSlot } from '@utils/renderSlot';
import { type BreadcrumbItemProps } from 'antd';

import {
  useItems as useMenuItems,
  withItemsContextProvider as withMenuItemsContextProvider,
} from '../../menu/context';
import { ItemHandler, type ItemHandlerProps } from '../context';

export const BreadcrumbItem = sveltify<
  BreadcrumbItemProps &
    ItemHandlerProps & {
      setSlotParams: SetSlotParams;
      itemSlots: Record<string, HTMLElement>;
    }
>(
  withMenuItemsContextProvider(
    ['menu.items', 'dropdownProps.menu.items'],
    ({ setSlotParams, itemSlots: slots, ...props }) => {
      const {
        items: {
          'menu.items': menuItems,
          'dropdownProps.menu.items': dropdownMenuItems,
        },
      } = useMenuItems<['menu.items', 'dropdownProps.menu.items']>();
      return (
        <ItemHandler
          {...props}
          itemProps={(itemProps) => {
            const menu = {
              ...(itemProps.menu || {}),
              items:
                itemProps.menu?.items || menuItems.length > 0
                  ? renderItems(menuItems, {
                      // clone???
                      clone: true,
                    })
                  : undefined,
              expandIcon:
                renderParamsSlot(
                  {
                    setSlotParams,
                    slots: slots,
                    key: 'menu.expandIcon',
                  },
                  {
                    clone: true,
                  }
                ) || itemProps.menu?.expandIcon,
              overflowedIndicator:
                renderSlot(slots['menu.overflowedIndicator']) ||
                itemProps.menu?.overflowedIndicator,
            };
            const dropdownMenu = {
              ...(itemProps.dropdownProps?.menu || {}),
              items:
                itemProps.dropdownProps?.menu?.items ||
                dropdownMenuItems.length > 0
                  ? renderItems(dropdownMenuItems, {
                      // clone???
                      clone: true,
                    })
                  : undefined,
              expandIcon:
                renderParamsSlot(
                  {
                    setSlotParams,
                    slots: slots,
                    key: 'dropdownProps.menu.expandIcon',
                  },
                  {
                    clone: true,
                  }
                ) || itemProps.dropdownProps?.menu?.expandIcon,
              overflowedIndicator:
                renderSlot(slots['dropdownProps.menu.overflowedIndicator']) ||
                itemProps.dropdownProps?.menu?.overflowedIndicator,
            };

            const dropdownProps = {
              ...(itemProps.dropdownProps || {}),
              dropdownRender: slots['dropdownProps.dropdownRender']
                ? renderParamsSlot(
                    {
                      setSlotParams,
                      slots: slots,
                      key: 'dropdownProps.dropdownRender',
                    },
                    {
                      clone: true,
                    }
                  )
                : createFunction(itemProps.dropdownProps?.dropdownRender),
              menu:
                Object.values(dropdownMenu).filter(Boolean).length > 0
                  ? dropdownMenu
                  : undefined,
            };
            return {
              ...itemProps,
              menu:
                Object.values(menu).filter(Boolean).length > 0
                  ? menu
                  : undefined,
              dropdownProps:
                Object.values(dropdownProps).filter(Boolean).length > 0
                  ? dropdownProps
                  : undefined,
            };
          }}
        />
      );
    }
  )
);

export default BreadcrumbItem;
