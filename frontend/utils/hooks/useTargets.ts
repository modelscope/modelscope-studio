import { type TreeNode } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { isNumber } from 'lodash-es';

export function useTargets(children: React.ReactNode, slotKey?: string) {
  const targets = useMemo(() => {
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
        if (
          isNumber(a.props.node.slotIndex) &&
          isNumber(b.props.node.slotIndex)
        ) {
          const slotIndexA = a.props.node.slotIndex || 0;
          const slotIndexB = b.props.node.slotIndex || 0;
          if (
            slotIndexA - slotIndexB === 0 &&
            a.props.node.subSlotIndex &&
            b.props.node.subSlotIndex
          ) {
            return (
              (a.props.node.subSlotIndex || 0) -
              (b.props.node.subSlotIndex || 0)
            );
          }
          return slotIndexA - slotIndexB;
        }
        return 0;
      })
      .map((child) => {
        return child.props.node.portalTarget;
      }) as HTMLElement[];
  }, [children, slotKey]);
  return targets;
}
