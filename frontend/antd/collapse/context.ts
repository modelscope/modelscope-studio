import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('collapse');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
