import { createItemsContext } from '@utils/createItemsContext';

export const { withItemsContextProvider, useItems, ItemHandler } =
  createItemsContext('antd-checkable-tag-group-options');

export * from '@utils/createItemsContext';
