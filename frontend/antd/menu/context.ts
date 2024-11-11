import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('menu');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
