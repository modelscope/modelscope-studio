import { createItemsContext } from '@utils/createItemsContext2';

export const { useItems, withItemsContextProvider, ItemHandler } =
  createItemsContext();

export const {
  useItems: useRoleItems,
  withItemsContextProvider: withRoleItemsContextProvider,
  ItemHandler: RoleItemHandler,
} = createItemsContext();
export * from '@utils/createItemsContext2';
