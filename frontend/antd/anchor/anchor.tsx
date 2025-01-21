import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { Anchor as AAnchor, type GetProps } from 'antd';

import { useItems, withItemsContextProvider } from './context';

type AnchorProps = GetProps<typeof AAnchor>;
export const Anchor = sveltify<AnchorProps>(
  withItemsContextProvider(
    ['items', 'default'],
    ({ getContainer, getCurrentAnchor, children, items, ...props }) => {
      const getContainerFunction = useFunction(getContainer);
      const getCurrentAnchorFunction = useFunction(getCurrentAnchor);
      const { items: slotItems } = useItems<['items', 'default']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <AAnchor
            {...props}
            items={useMemo(() => {
              // ["title"]
              return (
                items ||
                renderItems<NonNullable<AnchorProps['items']>[number]>(
                  resolvedSlotItems,
                  {
                    // clone???
                    clone: true,
                  }
                )
              );
            }, [items, resolvedSlotItems])}
            getContainer={getContainerFunction}
            getCurrentAnchor={getCurrentAnchorFunction}
          />
        </>
      );
    }
  )
);

export default Anchor;
