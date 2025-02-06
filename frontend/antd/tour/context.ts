import { createItemsContext } from '@utils/createItemsContext';

export const { withItemsContextProvider, useItems, ItemHandler } =
  createItemsContext('antd-tour-items');

export * from '@utils/createItemsContext';
