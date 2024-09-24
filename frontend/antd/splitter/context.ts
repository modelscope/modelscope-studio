import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('splitter');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
