import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('steps');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
