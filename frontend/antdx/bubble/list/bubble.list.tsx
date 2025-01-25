import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { Bubble as XBubble } from '@ant-design/x';
import type {
  BubbleListProps,
  RoleType,
} from '@ant-design/x/es/bubble/BubbleList';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';

import {
  useItems,
  useRoleItems,
  withItemsContextProvider,
  withRoleItemsContextProvider,
} from './context';

export const BubbleList = sveltify<
  BubbleListProps,
  ['avatar', 'content', 'footer', 'header', 'loadingRender', 'messageRender']
>(
  withRoleItemsContextProvider(
    ['roles'],
    withItemsContextProvider(
      ['items', 'default'],
      ({ items, roles: rolesProp, children, ...props }) => {
        const rolesFunction = useFunction(rolesProp);
        const {
          items: { roles: roleItems },
        } = useRoleItems<['roles']>();
        const { items: slotItems } = useItems<['items', 'default']>();
        const roles = useMemo(() => {
          return (
            rolesProp ||
            renderItems<
              RoleType & {
                role?: string;
              }
            >(roleItems, {
              clone: true,
              forceClone: true,
            })?.reduce(
              (acc, v) => {
                if (v.role !== undefined) {
                  acc[v.role] = v;
                }
                return acc;
              },
              {} as Record<string, RoleType>
            )
          );
        }, [roleItems, rolesProp]);
        const resolvedSlotItems =
          slotItems.items.length > 0 ? slotItems.items : slotItems.default;
        return (
          <>
            <div style={{ display: 'none' }}>{children}</div>
            <XBubble.List
              {...props}
              items={useMemo(() => {
                return (
                  items ||
                  renderItems<NonNullable<BubbleListProps['items']>[number]>(
                    resolvedSlotItems
                  )
                );
              }, [items, resolvedSlotItems])}
              roles={rolesFunction || roles}
            />
          </>
        );
      }
    )
  )
);

export default BubbleList;
