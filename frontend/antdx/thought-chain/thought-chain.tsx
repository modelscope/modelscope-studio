import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import {
  ThoughtChain as XThoughtChain,
  type ThoughtChainProps,
} from '@ant-design/x';
import { renderItems } from '@utils/renderItems';

import { useItems, withItemsContextProvider } from './context';

export const ThoughtChain = sveltify<ThoughtChainProps>(
  withItemsContextProvider(
    ['default', 'items'],
    ({ children, items, ...props }) => {
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
          />
        </>
      );
    }
  )
);

export default ThoughtChain;
