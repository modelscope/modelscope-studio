import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React from 'react';
import { createFunction } from '@utils/createFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { renderSlot } from '@utils/renderSlot';
import { type TableColumnProps } from 'antd';

import {
  useItems as useMenuItems,
  withItemsContextProvider as withMenuItemsContextProvider,
} from '../../menu/context';
import { ColumnItemHandler, type ItemHandlerProps } from '../context';

export const TableColumn = sveltify<
  TableColumnProps &
    ItemHandlerProps & {
      setSlotParams: SetSlotParams;
      itemSlots: Record<string, HTMLElement>;
    }
>(
  withMenuItemsContextProvider(
    ['filterDropdownProps.menu.items'],
    ({ setSlotParams, itemSlots: slots, ...props }) => {
      const {
        items: { 'filterDropdownProps.menu.items': dropdownMenuItems },
      } = useMenuItems<['filterDropdownProps.menu.items']>();
      return (
        <ColumnItemHandler
          {...props}
          itemProps={(itemProps) => {
            const filterDropdownMenu = {
              ...(itemProps.filterDropdownProps?.menu || {}),
              items:
                itemProps.filterDropdownProps?.menu?.items ||
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
                    key: 'filterDropdownProps.menu.expandIcon',
                  },
                  {
                    clone: true,
                  }
                ) || itemProps.filterDropdownProps?.menu?.expandIcon,
              overflowedIndicator:
                renderSlot(
                  slots['filterDropdownProps.menu.overflowedIndicator']
                ) || itemProps.filterDropdownProps?.menu?.overflowedIndicator,
            };

            const filterDropdownProps = {
              ...(itemProps.filterDropdownProps || {}),
              dropdownRender: slots['filterDropdownProps.dropdownRender']
                ? renderParamsSlot(
                    {
                      setSlotParams,
                      slots: slots,
                      key: 'filterDropdownProps.dropdownRender',
                    },
                    {
                      clone: true,
                    }
                  )
                : createFunction(itemProps.filterDropdownProps?.dropdownRender),
              menu:
                Object.values(filterDropdownMenu).filter(Boolean).length > 0
                  ? filterDropdownMenu
                  : undefined,
            };
            return {
              ...itemProps,
              filterDropdownProps:
                Object.values(filterDropdownProps).filter(Boolean).length > 0
                  ? filterDropdownProps
                  : undefined,
            };
          }}
        />
      );
    }
  )
);

export default TableColumn;
