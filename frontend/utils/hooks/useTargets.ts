import { type TreeNode, useStores } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { get, type Writable } from 'svelte/store';

export function useTargets(children: React.ReactNode, slotKey?: string) {
  const $targets = useMemo(() => {
    const array = React.Children.toArray(
      (children as Array<any> & { originalChildren: React.ReactNode })
        .originalChildren || children
    );
    return (
      array as React.ReactElement<{
        node: TreeNode;
        nodeSlotKey?: string;
      }>[]
    )
      .filter((child) => {
        return (
          child.props.node &&
          !child.props.node.ignore &&
          ((!slotKey && !child.props.nodeSlotKey) ||
            (slotKey && slotKey === child.props.nodeSlotKey))
        );
      })
      .sort((a, b) => {
        if (a.props.node.slotIndex && b.props.node.slotIndex) {
          const slotIndexA = get(a.props.node.slotIndex) || 0;
          const slotIndexB = get(b.props.node.slotIndex) || 0;
          if (
            slotIndexA - slotIndexB === 0 &&
            a.props.node.subSlotIndex &&
            b.props.node.subSlotIndex
          ) {
            return (
              (get(a.props.node.subSlotIndex) || 0) -
              (get(b.props.node.subSlotIndex) || 0)
            );
          }
          return slotIndexA - slotIndexB;
        }
        return 0;
      })
      .map((child) => {
        return child.props.node.target;
      }) as Writable<HTMLElement>[];
  }, [children, slotKey]);
  const targets = useStores($targets);
  return targets;
}
