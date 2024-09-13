import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('auto-complete');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
