import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('date-picker');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
