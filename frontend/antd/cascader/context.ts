import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('cascader');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
