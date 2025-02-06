import { createItemsContext } from '@utils/createItemsContext';

export const { useItems, withItemsContextProvider, ItemHandler } =
  createItemsContext('antdx-bubble.list-items');

export const {
  useItems: useRoleItems,
  withItemsContextProvider: withRoleItemsContextProvider,
  ItemHandler: RoleItemHandler,
} = createItemsContext('antdx-bubble.list-roles');

export * from '@utils/createItemsContext';
