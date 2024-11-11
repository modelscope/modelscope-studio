import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('timeline');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
