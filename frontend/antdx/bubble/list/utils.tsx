import { useMemo } from 'react';
import type {
  BubbleDataType,
  RolesType,
  RoleType,
} from '@ant-design/x/es/bubble/BubbleList';
import { useFunction } from '@utils/hooks/useFunction';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { patchSlots } from '@utils/patchSlots';
import { renderItems } from '@utils/renderItems';
import type { AvatarProps } from 'antd';
import { isFunction, isObject } from 'lodash-es';

import { useRoleItems } from './context';

export const messageIndexSymbol = Symbol();

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
      footer: patchSlotRender(role.footer, {
        unshift: true,
      }),
      header: patchSlotRender(role.header, {
        unshift: true,
      }),
      loadingRender: patchSlotRender(role.loadingRender, true),
      messageRender: patchSlotRender(role.messageRender, true),
    };
  });
}

export interface UseRolesRenderOptions<T = BubbleDataType> {
  roles?: RolesType;
  preProcess?: (bubbleProps: T, index: number) => RoleType;
  postProcess?: (bubbleProps: T, index: number) => RoleType | void;
}

export function useRolesRender<T = BubbleDataType>(
  { roles: rolesProp, preProcess, postProcess }: UseRolesRenderOptions<T>,
  deps: React.DependencyList = []
) {
  const rolesFunction = useFunction(rolesProp);
  const memoizedPreProcess = useMemoizedFn(preProcess);
  const memoizedPostProcess = useMemoizedFn(postProcess);

  const {
    items: { roles: roleItems },
  } = useRoleItems<['roles']>();

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
  const rolesRender = useMemo(() => {
    return (originalBubbleProps: BubbleDataType, i: number): RoleType => {
      const index = i ?? originalBubbleProps[messageIndexSymbol];
      const bubbleProps =
        memoizedPreProcess(originalBubbleProps as T, index) ||
        originalBubbleProps;
      if (bubbleProps.role && (roles || {})[bubbleProps.role]) {
        return patchBubbleSlots((roles || {})[bubbleProps.role], [
          bubbleProps,
          index,
        ]) as RoleType;
      }
      let postProcessResult: RoleType | void = undefined;
      postProcessResult = memoizedPostProcess(bubbleProps as T, index);
      if (postProcessResult) {
        return postProcessResult;
      }
      return {
        messageRender(content) {
          return <>{isObject(content) ? JSON.stringify(content) : content}</>;
        },
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, memoizedPostProcess, memoizedPreProcess, ...deps]);
  return rolesFunction || rolesRender;
}
