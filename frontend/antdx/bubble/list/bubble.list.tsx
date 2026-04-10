import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { Bubble as XBubble, type BubbleListProps } from '@ant-design/x';
import { renderItems } from '@utils/renderItems';

import {
  useItems,
  withItemsContextProvider,
  withRoleItemsContextProvider,
} from './context';
import { useRole } from './utils';

export const BubbleList = sveltify<BubbleListProps, ['items', 'roles']>(
  withRoleItemsContextProvider(
    ['role'],
    withItemsContextProvider(
      ['items', 'default'],
      ({ items, role, children, ...props }) => {
        const { items: slotItems } = useItems<['items', 'default']>();

        const resolvedRole = useRole({ role });
        const resolvedSlotItems = slotItems.items?.length
          ? slotItems.items
          : slotItems.default;

        return (
          <>
            <div style={{ display: 'none' }}>{children}</div>
            <XBubble.List
              {...props}
              role={resolvedRole}
              items={useMemo(() => {
                const resolvedItems =
                  items ||
                  renderItems<NonNullable<BubbleListProps['items']>[number]>(
                    resolvedSlotItems || []
                  );

                return resolvedItems;
              }, [items, resolvedSlotItems])}
            />
          </>
        );
      }
    )
  )
);

export default BubbleList;
