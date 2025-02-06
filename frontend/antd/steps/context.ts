import { createItemsContext } from '@utils/createItemsContext';

export const { withItemsContextProvider, useItems, ItemHandler } =
  createItemsContext('antd-steps-items');

export * from '@utils/createItemsContext';
