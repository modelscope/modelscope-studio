import { sveltify } from '@svelte-preprocess-react';
import { SuggestionContext } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { forwardRef, useMemo } from 'react';
import { Suggestion as XSuggestion, type SuggestionProps } from '@ant-design/x';
import type {
  RenderChildrenProps,
  SuggestionItem,
} from '@ant-design/x/es/suggestion';
import { useFunction } from '@utils/hooks/useFunction';
import { useMemoizedEqualValue } from '@utils/hooks/useMemoizedEqualValue';
import { renderItems } from '@utils/renderItems';

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
              shouldTrigger(e, {
                onTrigger: memoizedProps.onTrigger,
                onKeyDown: memoizedProps.onKeyDown,
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
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
      const itemsFunction = useFunction(items);
      const shouldTriggerFunction = useFunction(shouldTrigger);
      return (
        <>
          <XSuggestion
            {...props}
            items={useMemo(() => {
              return (
                itemsFunction ||
                items ||
                renderItems<SuggestionItem>(resolvedSlotItems, {
                  clone: true,
                }) || [{}]
              );
            }, [items, itemsFunction, resolvedSlotItems])}
          >
            {(childrenProps) => {
              return (
                <SuggestionChildrenWrapper
                  props={childrenProps}
                  shouldTrigger={shouldTriggerFunction}
                >
                  <div style={{ display: 'none' }}>{children}</div>
                  {slots.children ? <ReactSlot slot={slots.children} /> : null}
                </SuggestionChildrenWrapper>
              );
            }}
          </XSuggestion>
        </>
      );
    }
  )
);

export default Suggestion;
