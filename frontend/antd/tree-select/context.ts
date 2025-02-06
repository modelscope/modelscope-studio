import { createItemsContext } from '@utils/createItemsContext';

export const { withItemsContextProvider, useItems, ItemHandler } =
  createItemsContext('antd-tree-select-tree-nodes');

export * from '@utils/createItemsContext';
