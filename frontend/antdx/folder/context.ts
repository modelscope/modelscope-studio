import { createItemsContext } from '@utils/createItemsContext';

export const {
  withItemsContextProvider: withTreeNodeItemsContextProvider,
  useItems: useTreeNodeItems,
  ItemHandler: TreeNodeItemHandler,
} = createItemsContext('antdx-folder-tree-nodes');

export const {
  withItemsContextProvider: withDirectoryIconItemsContextProvider,
  useItems: useDirectoryIconItems,
  ItemHandler: DirectoryIconItemHandler,
} = createItemsContext('antdx-folder-directory-icons');

export * from '@utils/createItemsContext';
