import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import {
  type PromptProps,
  Prompts as XPrompts,
  type PromptsProps,
} from '@ant-design/x';
import { renderItems } from '@utils/renderItems';

import { useItems, withItemsContextProvider } from './context';

export const Prompts = sveltify<PromptsProps, ['title']>(
  withItemsContextProvider(
    ['default', 'items'],
    ({ slots, children, items, ...props }) => {
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;

      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <XPrompts
            {...props}
            title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
            items={useMemo(() => {
              return (
                items ||
                renderItems<PromptProps>(resolvedSlotItems, {
                  clone: true,
                })
              );
            }, [items, resolvedSlotItems])}
          />
        </>
      );
    }
  )
);

export default Prompts;
