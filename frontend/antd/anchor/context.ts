import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('anchor');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
