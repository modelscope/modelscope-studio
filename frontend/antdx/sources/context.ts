import { createItemsContext } from '@utils/createItemsContext';

export const { useItems, withItemsContextProvider, ItemHandler } =
  createItemsContext('antdx-sources-items');

export * from '@utils/createItemsContext';
