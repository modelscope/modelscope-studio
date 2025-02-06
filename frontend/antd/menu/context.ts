import { createItemsContext } from '@utils/createItemsContext';

export const { useItems, withItemsContextProvider, ItemHandler } =
  createItemsContext('antd-menu-items');

export * from '@utils/createItemsContext';
