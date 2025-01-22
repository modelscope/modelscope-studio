import { createItemsContext } from '@utils/createItemsContext2';

export const {
  useItems: useColumnItems,
  withItemsContextProvider: withColumnItemsContextProvider,
  ItemHandler: ColumnItemHandler,
} = createItemsContext();

// row selection selection
export const {
  useItems: useSelectionItems,
  withItemsContextProvider: withSelectionItemsContextProvider,
  ItemHandler: SelectionItemHandler,
} = createItemsContext();

export const {
  useItems: useRowSelectionItems,
  withItemsContextProvider: withRowSelectionItemsContextProvider,
  ItemHandler: RowSelectionItemHandler,
} = createItemsContext();

export const {
  useItems: useExpandableItems,
  withItemsContextProvider: withExpandableItemsContextProvider,
  ItemHandler: ExpandableItemHandler,
} = createItemsContext();

export * from '@utils/createItemsContext2';
