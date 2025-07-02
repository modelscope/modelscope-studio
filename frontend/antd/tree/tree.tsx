import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Tree as ATree } from 'antd';

import { useItems, withItemsContextProvider } from './context';

type TreeProps = GetProps<typeof ATree>;

export const Tree = sveltify<
  TreeProps & {
    directory?: boolean;
    setSlotParams: SetSlotParams;
    onLoadData?: (...args: any[]) => Promise<any>;
  },
  [
    'switcherLoadingIcon',
    'switcherIcon',
    'showLine.showLeafIcon',
    'icon',
    'draggable.icon',
    'titleRender',
  ]
>(
  withItemsContextProvider(
    ['default', 'treeData'],
    ({
      slots,
      filterTreeNode,
      treeData,
      draggable,
      allowDrop,
      onCheck,
      onSelect,
      onExpand,
      children,
      directory,
      setSlotParams,
      onLoadData,
      titleRender,
      ...props
    }) => {
      const filterTreeNodeFunction = useFunction(filterTreeNode);
      const draggableFunction = useFunction(draggable);
      const titleRenderFunction = useFunction(titleRender);
      const draggableNodeDraggableFunction = useFunction(
        typeof draggable === 'object' ? draggable.nodeDraggable : undefined
      );
      const allowDropFunction = useFunction(allowDrop);
      const TreeComponent = directory ? ATree.DirectoryTree : ATree;
      const { items: slotItems } = useItems<['default', 'treeData']>();
      const resolvedSlotItems =
        slotItems.treeData.length > 0 ? slotItems.treeData : slotItems.default;
      const componentProps = useMemo(() => {
        return {
          ...props,
          treeData:
            treeData ||
            renderItems<NonNullable<TreeProps['treeData']>[number]>(
              resolvedSlotItems,
              {
                clone: true,
              }
            ),
          showLine: slots['showLine.showLeafIcon']
            ? {
                showLeafIcon: renderParamsSlot({
                  slots,
                  setSlotParams,
                  key: 'showLine.showLeafIcon',
                }),
              }
            : props.showLine,
          icon: slots.icon
            ? renderParamsSlot({ slots, setSlotParams, key: 'icon' })
            : props.icon,
          switcherLoadingIcon: slots.switcherLoadingIcon ? (
            <ReactSlot slot={slots.switcherLoadingIcon} />
          ) : (
            props.switcherLoadingIcon
          ),
          switcherIcon: slots.switcherIcon
            ? renderParamsSlot({ slots, setSlotParams, key: 'switcherIcon' })
            : props.switcherIcon,
          titleRender: slots.titleRender
            ? renderParamsSlot({ slots, setSlotParams, key: 'titleRender' })
            : titleRenderFunction,
          draggable:
            slots['draggable.icon'] || draggableNodeDraggableFunction
              ? {
                  icon: slots['draggable.icon'] ? (
                    <ReactSlot slot={slots['draggable.icon']} />
                  ) : typeof draggable === 'object' ? (
                    draggable.icon
                  ) : undefined,
                  nodeDraggable: draggableNodeDraggableFunction,
                }
              : draggableFunction || draggable,
          // eslint-disable-next-line require-await
          loadData: async (...args: any[]) => onLoadData?.(...args),
        };
      }, [
        props,
        treeData,
        resolvedSlotItems,
        slots,
        setSlotParams,
        draggableNodeDraggableFunction,
        draggable,
        titleRenderFunction,
        draggableFunction,
        onLoadData,
      ]);
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <TreeComponent
            {...omitUndefinedProps(componentProps)}
            filterTreeNode={filterTreeNodeFunction}
            allowDrop={allowDropFunction}
            onSelect={(selected, ...args) => {
              onSelect?.(selected, ...args);
            }}
            onExpand={(expanded, ...args) => {
              onExpand?.(expanded, ...args);
            }}
            onCheck={(checked, ...args) => {
              onCheck?.(checked, ...args);
            }}
          />
        </>
      );
    }
  )
);
export default Tree;
