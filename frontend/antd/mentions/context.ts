import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('mentions');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
