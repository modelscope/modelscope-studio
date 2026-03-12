import { sveltify } from '@svelte-preprocess-react';
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
      itemSlots: Record<
        [
          'title',
          'menu.expandIcon',
          'menu.overflowedIndicator',
          'menu.items',
          'dropdownProps.dropdownRender',
          'dropdownProps.popupRender',
          'dropdownProps.menu.expandIcon',
          'dropdownProps.menu.overflowedIndicator',
          'dropdownProps.menu.items',
        ][number],
        HTMLElement
      >;
    }
>(
  withMenuItemsContextProvider(
    ['menu.items', 'dropdownProps.menu.items'],
    ({ itemSlots: slots, ...props }) => {
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
                itemProps.menu?.items || menuItems?.length > 0
                  ? renderItems(menuItems, {
                      clone: true,
                    })
                  : undefined,
              expandIcon:
                renderParamsSlot(
                  {
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
                dropdownMenuItems?.length > 0
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
                      slots: slots,
                      key: 'dropdownProps.dropdownRender',
                    },
                    {
                      clone: true,
                    }
                  )
                : createFunction(itemProps.dropdownProps?.dropdownRender),
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
                : createFunction(itemProps.dropdownProps?.popupRender),
              menu:
                Object.values(dropdownMenu).filter(Boolean).length > 0
                  ? dropdownMenu
                  : undefined,
            };

            return {
              ...itemProps,
              title: renderSlot(slots.title) || itemProps.title,
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
