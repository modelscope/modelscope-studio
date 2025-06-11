import { createItemsContext } from '@utils/createItemsContext';

export const { useItems, withItemsContextProvider, ItemHandler } =
  createItemsContext('antdx-actions-items');

export * from '@utils/createItemsContext';
