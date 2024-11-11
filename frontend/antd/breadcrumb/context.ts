import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('breadcrumb');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
