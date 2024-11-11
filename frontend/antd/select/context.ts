import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('select');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
