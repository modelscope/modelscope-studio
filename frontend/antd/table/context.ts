import { createItemsContext } from '@utils/createItemsContext';

const { getItems: getColumnItems, getSetItemFn: getSetColumnItemFn } =
  createItemsContext('table-column');

const { getItems: getSelectionItems, getSetItemFn: getSetSelectionItemFn } =
  createItemsContext('table-row-selection-selection');

const {
  getItems: getRowSelectionItems,
  getSetItemFn: getSetRowSelectionItemFn,
} = createItemsContext('table-row-selection');

const { getItems: getExpandableItems, getSetItemFn: getSetExpandableItemFn } =
  createItemsContext('table-expandable');

export {
  getColumnItems,
  getExpandableItems,
  getRowSelectionItems,
  getSelectionItems,
  getSetColumnItemFn,
  getSetExpandableItemFn,
  getSetRowSelectionItemFn,
  getSetSelectionItemFn,
};
export * from '@utils/createItemsContext';
