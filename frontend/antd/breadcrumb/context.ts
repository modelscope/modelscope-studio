import { createItemsContext } from '@utils/createItemsContext';

export const { useItems, withItemsContextProvider, ItemHandler } =
  createItemsContext('antd-breadcrumb-items');

export * from '@utils/createItemsContext';
