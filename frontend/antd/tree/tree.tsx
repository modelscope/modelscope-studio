import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Tree as ATree } from 'antd';

import { type Item } from './context';

type TreeProps = GetProps<typeof ATree>;

export const Tree = sveltify<
  TreeProps & {
    slotItems: Item[];
    directory?: boolean;
    onValueChange: (options: {
      expandedKeys?: React.Key[];
      selectedKeys?: React.Key[];
      checkedKeys?:
        | React.Key[]
        | { checked: React.Key[]; halfChecked: React.Key[] };
    }) => void;
    setSlotParams: SetSlotParams;
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
  ({
    slots,
    filterTreeNode,
    treeData,
    draggable,
    allowDrop,
    onValueChange,
    onCheck,
    onSelect,
    onExpand,
    children,
    directory,
    slotItems,
    setSlotParams,
    ...props
  }) => {
    const filterTreeNodeFunction = useFunction(filterTreeNode);
    const draggableFunction = useFunction(draggable);
    const draggableNodeDraggableFunction = useFunction(
      typeof draggable === 'object' ? draggable.nodeDraggable : undefined
    );
    const allowDropFunction = useFunction(allowDrop);
    const TreeComponent = directory ? ATree.DirectoryTree : ATree;
    const componentProps = useMemo(() => {
      return {
        ...props,
        treeData:
          treeData ||
          renderItems<NonNullable<TreeProps['treeData']>[number]>(slotItems),
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
          : props.titleRender,
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
      };
    }, [
      draggable,
      draggableFunction,
      draggableNodeDraggableFunction,
      props,
      slotItems,
      slots,
      treeData,
      setSlotParams,
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
            onValueChange({
              selectedKeys: selected,
              expandedKeys: props.expandedKeys,
              checkedKeys: props.checkedKeys,
            });
          }}
          onExpand={(expanded, ...args) => {
            onExpand?.(expanded, ...args);
            onValueChange({
              expandedKeys: expanded,
              selectedKeys: props.selectedKeys,
              checkedKeys: props.checkedKeys,
            });
          }}
          onCheck={(checked, ...args) => {
            onCheck?.(checked, ...args);
            onValueChange({
              checkedKeys: checked,
              selectedKeys: props.selectedKeys,
              expandedKeys: props.expandedKeys,
            });
          }}
        />
      </>
    );
  }
);
export default Tree;
