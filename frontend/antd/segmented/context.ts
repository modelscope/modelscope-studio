import { createItemsContext } from '@utils/createItemsContext';

const { getItems, getSetItemFn } = createItemsContext('segmented');

export { getItems, getSetItemFn };
export * from '@utils/createItemsContext';
