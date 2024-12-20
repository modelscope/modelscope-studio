import { createItemsContext } from '@utils/createItemsContext';

const { getItems: getRoleItems, getSetItemFn: getSetRoleItemFn } =
  createItemsContext('antdx-bubble-role');

const { getItems, getSetItemFn } = createItemsContext('antdx-bubble');

export { getItems, getRoleItems, getSetItemFn, getSetRoleItemFn };
export * from '@utils/createItemsContext';
