import { createItemsContext } from '@utils/createItemsContext';

export const { useItems, withItemsContextProvider, ItemHandler } =
  createItemsContext('antdx-suggestion-chain-items');

export * from '@utils/createItemsContext';
