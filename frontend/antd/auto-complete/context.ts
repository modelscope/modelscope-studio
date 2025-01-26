import { createItemsContext } from '@utils/createItemsContext';

export const { useItems, withItemsContextProvider, ItemHandler } =
  createItemsContext('antd-auto-complete-options');

export * from '@utils/createItemsContext';
