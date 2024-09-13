import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('slider');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
