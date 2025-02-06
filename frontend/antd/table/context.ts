import { createItemsContext } from '@utils/createItemsContext';

export const {
  useItems: useColumnItems,
  withItemsContextProvider: withColumnItemsContextProvider,
  ItemHandler: ColumnItemHandler,
} = createItemsContext('antd-table-columns');

// row selection selection
export const {
  useItems: useSelectionItems,
  withItemsContextProvider: withSelectionItemsContextProvider,
  ItemHandler: SelectionItemHandler,
} = createItemsContext('antd-table-row-selection-selections');

export const {
  useItems: useRowSelectionItems,
  withItemsContextProvider: withRowSelectionItemsContextProvider,
  ItemHandler: RowSelectionItemHandler,
} = createItemsContext('antd-table-row-selection');

export const {
  useItems: useExpandableItems,
  withItemsContextProvider: withExpandableItemsContextProvider,
  ItemHandler: ExpandableItemHandler,
} = createItemsContext('antd-table-expandable');

export * from '@utils/createItemsContext';
