import { useMemo } from 'react';
import type {
  BubbleItemType,
  RoleProps,
  RoleType,
} from '@ant-design/x/es/bubble/interface';
import { createFunction } from '@utils/createFunction';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { patchSlots } from '@utils/patchSlots';
import { renderItems } from '@utils/renderItems';
import { isFunction, isObject } from 'lodash-es';

import { useRoleItems } from './context';

export const messageIndexSymbol = Symbol();

function patchBubbleSlots(role: RoleProps, params: any[]) {
  return patchSlots(params, (patchSlotRender) => {
    return {
      ...role,
      avatar: patchSlotRender(role.avatar, {
        // unshift: true,
      }),
      extra: patchSlotRender(role.extra, {
        // unshift: true,
      }),
      footer: patchSlotRender(role.footer, {
        // unshift: true,
      }),
      header: patchSlotRender(role.header, {
        // unshift: true,
      }),
      loadingRender: patchSlotRender(role.loadingRender, {
        // unshift: true,
      }),
      contentRender: patchSlotRender(role.contentRender, {
        // unshift: true,
      }),
    };
  });
}

export interface UseRoleOptions<T = BubbleItemType> {
  role?: RoleType;
  preProcess?: (bubbleProps: T, index: number) => RoleProps;
  defaultRolePostProcess?: (bubbleProps: T, index: number) => RoleProps | void;
}

export function useRole<T = BubbleItemType>(
  { role: roleProp, preProcess, defaultRolePostProcess }: UseRoleOptions<T>,
  deps: React.DependencyList = []
) {
  const memoizedPreProcess = useMemoizedFn(preProcess);
  const memoizedDefaultRolePostProcess = useMemoizedFn(defaultRolePostProcess);

  const {
    items: { role: roleItems },
  } = useRoleItems<['role']>();
  const role = useMemo(() => {
    return (
      roleProp ||
      (roleItems?.length
        ? renderItems<
            RoleProps & {
              role?: string;
            }
          >(roleItems || [], {
            clone: true,
            forceClone: true,
          })?.reduce(
            (acc, v) => {
              if (v.role !== undefined) {
                acc[v.role] = v;
              }
              return acc;
            },
            {} as Record<string, RoleProps>
          )
        : {}) ||
      {}
    );
  }, [roleItems, roleProp]);

  const resolvedRole: typeof role = useMemo(() => {
    return new Proxy(
      {},
      {
        get: (_, key: string) => {
          if (typeof role[key] === 'string') {
            const functionRole = createFunction(role[key]);
            if (functionRole) {
              return functionRole;
            }
          } else {
            return (data: T) => {
              const index = data[messageIndexSymbol];
              const preProcessResult = memoizedPreProcess(data, index) || data;
              if (role[key]) {
                return patchBubbleSlots(
                  isFunction(role[key])
                    ? role[key](preProcessResult as BubbleItemType)
                    : role[key],
                  [preProcessResult, index]
                );
              }
              const postProcessResult = memoizedDefaultRolePostProcess(
                preProcessResult as T,
                index
              );
              if (postProcessResult) {
                return postProcessResult;
              }
              return {
                contentRender(content: any) {
                  return (
                    <>{isObject(content) ? JSON.stringify(content) : content}</>
                  );
                },
              };
            };
          }
        },
      }
    );
  }, [
    role,
    memoizedPreProcess,
    memoizedDefaultRolePostProcess,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...deps,
  ]);

  return resolvedRole;
}
