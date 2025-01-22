import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { renderItems } from '@utils/renderItems';
import { type TableProps } from 'antd';

import {
  type ItemHandlerProps,
  RowSelectionItemHandler,
  useSelectionItems,
  withSelectionItemsContextProvider,
} from '../context';

export const TableRowSelection = sveltify<
  NonNullable<TableProps['rowSelection']> & ItemHandlerProps
>(
  withSelectionItemsContextProvider(['selections'], (props) => {
    const {
      items: { selections: selectionsItems },
    } = useSelectionItems<['selections']>();
    return (
      <RowSelectionItemHandler
        {...props}
        itemProps={(itemProps) => {
          return {
            ...itemProps,
            selections:
              selectionsItems.length > 0
                ? renderItems(selectionsItems)
                : itemProps.selections,
          };
        }}
      />
    );
  })
);

export default TableRowSelection;
