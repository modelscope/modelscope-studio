import { sveltify } from '@svelte-preprocess-react';
import {
  SuggestionContext,
  SuggestionOpenContext,
} from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { Suggestion as XSuggestion, type SuggestionProps } from '@ant-design/x';
import type {
  RenderChildrenProps,
  SuggestionItem,
} from '@ant-design/x/es/suggestion';
import { useFunction } from '@utils/hooks/useFunction';
import { useMemoizedEqualValue } from '@utils/hooks/useMemoizedEqualValue';
import { patchSlots } from '@utils/patchSlots';
import { renderItems } from '@utils/renderItems';
import { isUndefined } from 'lodash-es';

import { useItems, withItemsContextProvider } from './context';

// eslint-disable-next-line react/display-name
const SuggestionChildrenWrapper = forwardRef<
  HTMLElement,
  {
    children?: React.ReactNode;
    props: RenderChildrenProps<any>;
    shouldTrigger?: (
      e: React.KeyboardEvent,
      options: {
        onTrigger: RenderChildrenProps<any>['onTrigger'];
        onKeyDown: RenderChildrenProps<any>['onKeyDown'];
      }
    ) => void;
  }
>(({ children, props, shouldTrigger }, ref) => {
  const memoizedProps = useMemoizedEqualValue(props);

  return (
    <SuggestionContext.Provider
      value={useMemo(() => {
        return {
          ...memoizedProps,
          onKeyDown: (e) => {
            if (shouldTrigger) {
              requestAnimationFrame(() => {
                shouldTrigger(e, {
                  onTrigger: memoizedProps.onTrigger,
                  onKeyDown: memoizedProps.onKeyDown,
                });
              });
            } else {
              memoizedProps.onKeyDown?.(e);
            }
          },
          elRef: ref,
        } as RenderChildrenProps<any>;
      }, [memoizedProps, shouldTrigger, ref])}
    >
      {children}
    </SuggestionContext.Provider>
  );
});

export const Suggestion = sveltify<
  Omit<SuggestionProps, 'children'> & {
    children?: React.ReactNode;
    shouldTrigger?: (
      e: React.KeyboardEvent,
      options: {
        onTrigger: RenderChildrenProps<any>['onTrigger'];
        onKeyDown: RenderChildrenProps<any>['onKeyDown'];
      }
    ) => void;
  },
  ['children']
>(
  withItemsContextProvider(
    ['default', 'items'],
    ({ children, items, shouldTrigger, slots, ...props }) => {
      const [open, setOpen] = useState(() => props.open ?? false);
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
      const itemsFunction = useFunction(items);
      const shouldTriggerFunction = useFunction(shouldTrigger);
      const resolvedItems = useMemo(() => {
        return (items ||
          renderItems<SuggestionItem>(resolvedSlotItems, {
            clone: true,
          }) || [{}]) as SuggestionItem[];
      }, [items, resolvedSlotItems]);
      const itemsRender: SuggestionProps['items'] = useMemo(() => {
        return (...args) => {
          return resolvedItems.map((item) => {
            return patchSlots(args, (patchSlotRender) => {
              const patch = (
                suggestionItem: SuggestionItem
              ): SuggestionItem => {
                return {
                  ...suggestionItem,
                  extra: patchSlotRender(suggestionItem.extra),
                  icon: patchSlotRender(suggestionItem.icon),
                  label: patchSlotRender(suggestionItem.label),
                  children: suggestionItem.children?.map((sub) => {
                    return patch(sub);
                  }),
                };
              };
              return patch(item);
            });
          });
        };
      }, [resolvedItems]);

      useEffect(() => {
        if (!isUndefined(props.open)) {
          setOpen(props.open);
        }
      }, [props.open]);
      return (
        <>
          <XSuggestion
            {...props}
            items={itemsFunction || itemsRender}
            onOpenChange={(suggestionOpen, ...args) => {
              if (isUndefined(props.open)) {
                setOpen(suggestionOpen);
              }
              props.onOpenChange?.(suggestionOpen, ...args);
            }}
          >
            {(childrenProps) => {
              return (
                <SuggestionOpenContext.Provider value={open}>
                  <SuggestionChildrenWrapper
                    props={childrenProps}
                    shouldTrigger={shouldTriggerFunction}
                  >
                    <div style={{ display: 'none' }}>{children}</div>
                    {slots.children ? (
                      <ReactSlot slot={slots.children} />
                    ) : null}
                  </SuggestionChildrenWrapper>
                </SuggestionOpenContext.Provider>
              );
            }}
          </XSuggestion>
        </>
      );
    }
  )
);

export default Suggestion;
