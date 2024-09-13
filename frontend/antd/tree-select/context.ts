import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('tree-select');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
