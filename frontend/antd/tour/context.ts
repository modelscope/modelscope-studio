import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('tour');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
