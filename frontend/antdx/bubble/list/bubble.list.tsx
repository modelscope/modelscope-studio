import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { Bubble as XBubble } from '@ant-design/x';
import type {
  BubbleListProps,
  RoleType,
} from '@ant-design/x/es/bubble/BubbleList';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';

import { type Item } from './context';

export const BubbleList = sveltify<
  BubbleListProps & {
    slotItems: Item[];
    roleItems: Item[];
  },
  ['avatar', 'content', 'footer', 'header', 'loadingRender', 'messageRender']
>(({ items, roles: rolesProp, slotItems, roleItems, children, ...props }) => {
  const rolesFunction = useFunction(rolesProp);
  const roles = useMemo(() => {
    return (
      rolesProp ||
      renderItems<
        RoleType & {
          role?: string;
        }
      >(roleItems)?.reduce(
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
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <XBubble.List
        {...props}
        items={useMemo(() => {
          return (
            items ||
            renderItems<NonNullable<BubbleListProps['items']>[number]>(
              slotItems
            )
          );
        }, [items, slotItems])}
        roles={rolesFunction || roles}
      />
    </>
  );
});

export default BubbleList;
