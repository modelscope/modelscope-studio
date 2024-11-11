import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('checkbox-group');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
