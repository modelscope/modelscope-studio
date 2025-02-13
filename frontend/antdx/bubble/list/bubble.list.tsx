import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { Bubble as XBubble, type BubbleProps } from '@ant-design/x';
import type {
  BubbleListProps,
  RoleType,
} from '@ant-design/x/es/bubble/BubbleList';
import { useFunction } from '@utils/hooks/useFunction';
import { patchSlots } from '@utils/patchSlots';
import { renderItems } from '@utils/renderItems';
import type { AvatarProps } from 'antd';
import { isFunction, isObject } from 'lodash-es';

import {
  useItems,
  useRoleItems,
  withItemsContextProvider,
  withRoleItemsContextProvider,
} from './context';

function patchBubbleSlots(role: RoleType, params: any[]) {
  return patchSlots(params, (patchSlotRender) => {
    return {
      ...role,
      avatar: isFunction(role.avatar)
        ? patchSlotRender(role.avatar)
        : isObject(role.avatar)
          ? {
              ...role.avatar,
              icon: patchSlotRender((role.avatar as AvatarProps)?.icon),
              src: patchSlotRender((role.avatar as AvatarProps)?.src),
            }
          : role.avatar,
      footer: patchSlotRender(role.footer),
      header: patchSlotRender(role.header),
      loadingRender: patchSlotRender(role.loadingRender, true),
      messageRender: patchSlotRender(role.messageRender, true),
    };
  });
}

export const BubbleList = sveltify<BubbleListProps, ['items', 'roles']>(
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
        const rolesRender = useMemo(() => {
          return (bubbleProps: BubbleProps, index: number): RoleType => {
            if (bubbleProps.role && (roles || {})[bubbleProps.role]) {
              return patchBubbleSlots((roles || {})[bubbleProps.role], [
                bubbleProps,
                index,
              ]) as RoleType;
            }
            return {
              messageRender(content) {
                return (
                  <>{isObject(content) ? JSON.stringify(content) : content}</>
                );
              },
            };
          };
        }, [roles]);
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
              roles={rolesFunction || rolesRender}
            />
          </>
        );
      }
    )
  )
);

export default BubbleList;
