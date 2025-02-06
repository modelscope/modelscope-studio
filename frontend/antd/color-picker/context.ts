import { createItemsContext } from '@utils/createItemsContext';

export const { withItemsContextProvider, useItems, ItemHandler } =
  createItemsContext('antd-color-picker-presets');

export * from '@utils/createItemsContext';
