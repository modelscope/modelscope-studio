import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('color-picker');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
