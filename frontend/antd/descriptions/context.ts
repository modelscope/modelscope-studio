import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('descriptions');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
