import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('tree');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
