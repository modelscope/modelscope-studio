import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { Sources as XSources, type SourcesProps } from '@ant-design/x';
import { renderItems } from '@utils/renderItems';

import { useItems, withItemsContextProvider } from './context';

export const Sources = sveltify<SourcesProps, ['title']>(
  withItemsContextProvider(
    ['default', 'items'],
    ({ children, items, slots, ...props }) => {
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <XSources
            {...props}
            title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
            items={useMemo(() => {
              return (
                items ||
                renderItems<NonNullable<SourcesProps['items']>[number]>(
                  resolvedSlotItems,
                  {
                    clone: true,
                  }
                )
              );
            }, [items, resolvedSlotItems])}
          />
        </>
      );
    }
  )
);

export default Sources;
