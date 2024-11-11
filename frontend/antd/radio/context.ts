import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('radio-group');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
