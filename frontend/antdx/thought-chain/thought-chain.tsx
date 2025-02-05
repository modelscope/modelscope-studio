import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import {
  ThoughtChain as XThoughtChain,
  type ThoughtChainProps,
} from '@ant-design/x';
import { renderItems } from '@utils/renderItems';

import { useItems, withItemsContextProvider } from './context';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

export const ThoughtChain = sveltify<ThoughtChainProps>(
  withItemsContextProvider(
    ['default', 'items'],
    ({ children, items, ...props }) => {
      const supportCollapsibleConfig = typeof props.collapsible === 'object';
      const collapsibleConfig = getConfig(props.collapsible);

      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;

      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <XThoughtChain
            {...props}
            items={useMemo(() => {
              return (
                items ||
                renderItems<NonNullable<ThoughtChainProps['items']>[number]>(
                  resolvedSlotItems,
                  {
                    clone: true,
                  }
                )
              );
            }, [items, resolvedSlotItems])}
            collapsible={
              supportCollapsibleConfig
                ? (collapsibleConfig as typeof props.collapsible)
                : props.collapsible
            }
          />
        </>
      );
    }
  )
);

export default ThoughtChain;
