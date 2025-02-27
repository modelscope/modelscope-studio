import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { Bubble as XBubble } from '@ant-design/x';
import type { BubbleListProps } from '@ant-design/x/es/bubble/BubbleList';
import { renderItems } from '@utils/renderItems';

import {
  useItems,
  withItemsContextProvider,
  withRoleItemsContextProvider,
} from './context';
import { useRolesRender } from './utils';

export const BubbleList = sveltify<BubbleListProps, ['items', 'roles']>(
  withRoleItemsContextProvider(
    ['roles'],
    withItemsContextProvider(
      ['items', 'default'],
      ({ items, roles, children, ...props }) => {
        const { items: slotItems } = useItems<['items', 'default']>();

        const rolesRender = useRolesRender({
          roles,
        });

        const resolvedSlotItems =
          slotItems.items.length > 0 ? slotItems.items : slotItems.default;

        return (
          <>
            <div style={{ display: 'none' }}>{children}</div>
            <XBubble.List
              {...props}
              items={useMemo(() => {
                const resolvedItems =
                  items ||
                  renderItems<NonNullable<BubbleListProps['items']>[number]>(
                    resolvedSlotItems
                  );

                return resolvedItems;
              }, [items, resolvedSlotItems])}
              roles={rolesRender}
            />
          </>
        );
      }
    )
  )
);

export default BubbleList;
