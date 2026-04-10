import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { Folder as XFolder, type FolderProps } from '@ant-design/x';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';

import {
  useDirectoryIconItems,
  useTreeNodeItems,
  withDirectoryIconItemsContextProvider,
  withTreeNodeItemsContextProvider,
} from './context';

export const Folder = sveltify<
  FolderProps & {
    children?: React.ReactNode;
    fileContentService?: {
      onLoadFileContent?: (filePath: string) => Promise<string>;
    };
  },
  ['emptyRender', 'previewRender', 'directoryTitle', 'previewTitle']
>(
  withTreeNodeItemsContextProvider(
    ['default', 'treeData'],
    withDirectoryIconItemsContextProvider(
      ['directoryIcons'],
      ({
        slots,
        children,
        previewRender,
        previewTitle,
        fileContentService,
        ...props
      }) => {
        const { items: treeNodeItems } =
          useTreeNodeItems<['default', 'treeData']>();
        const resolvedTreeNodeItems =
          treeNodeItems.treeData.length > 0
            ? treeNodeItems.treeData
            : treeNodeItems.default;
        const { items: directoryIconItems } =
          useDirectoryIconItems<['directoryIcons']>();
        const previewRenderFunction = useFunction(previewRender, true);
        const previewTitleFunction = useFunction(previewTitle, true);

        return (
          <>
            <div style={{ display: 'none' }}>{children}</div>
            <XFolder
              {...props}
              fileContentService={
                fileContentService?.onLoadFileContent
                  ? {
                      loadFileContent: fileContentService.onLoadFileContent,
                    }
                  : undefined
              }
              treeData={useMemo(() => {
                return (
                  props.treeData ||
                  renderItems<NonNullable<FolderProps['treeData']>[number]>(
                    resolvedTreeNodeItems,
                    {
                      clone: true,
                    }
                  ) ||
                  []
                );
              }, [props.treeData, resolvedTreeNodeItems])}
              directoryIcons={useMemo(() => {
                return (
                  props.directoryIcons ||
                  renderItems<{
                    extension: string;
                    children: React.ReactNode;
                  }>(directoryIconItems.directoryIcons, {
                    clone: true,
                  })?.reduce(
                    (acc, cur) => {
                      acc[cur.extension] = cur.children;
                      return acc;
                    },
                    {} as Record<string, React.ReactNode>
                  )
                );
              }, [directoryIconItems.directoryIcons, props.directoryIcons])}
              emptyRender={
                slots.emptyRender ? (
                  <ReactSlot slot={slots.emptyRender} />
                ) : (
                  props.emptyRender
                )
              }
              directoryTitle={
                slots.directoryTitle ? (
                  <ReactSlot slot={slots.directoryTitle} />
                ) : (
                  props.directoryTitle
                )
              }
              previewTitle={
                slots.previewTitle ? (
                  <ReactSlot slot={slots.previewTitle} />
                ) : (
                  previewTitleFunction || previewTitle
                )
              }
              previewRender={
                slots.previewRender
                  ? renderParamsSlot({ slots, key: 'previewRender' })
                  : previewRenderFunction || previewRender
              }
            />
          </>
        );
      }
    )
  )
);

export default Folder;
