import { type TreeNode } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';

export function useSlotsChildren(
  children: React.ReactNode
): [slotsChildren: React.ReactNode[], restChildren: React.ReactNode[]] {
  return useMemo(() => {
    const array = React.Children.toArray(children) as React.ReactElement<{
      node: TreeNode;
      nodeSlotKey?: string;
    }>[];
    const slotsChildren: React.ReactNode[] = [];
    const restChildren: React.ReactNode[] = [];
    array.forEach((child) => {
      if (child.props.node && child.props.nodeSlotKey) {
        slotsChildren.push(child);
      } else {
        restChildren.push(child);
      }
    });
    return [slotsChildren, restChildren];
  }, [children]);
}
