import { createItemsContext } from '@utils/createItemsContext';

export const { useItems, withItemsContextProvider, ItemHandler } =
  createItemsContext('antdx-thought-chain-items');

export * from '@utils/createItemsContext';
