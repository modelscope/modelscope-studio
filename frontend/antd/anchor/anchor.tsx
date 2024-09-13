import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { Anchor as AAnchor, type GetProps } from 'antd';

import { type Item } from './context';

type AnchorProps = GetProps<typeof AAnchor>;
export const Anchor = sveltify<
  AnchorProps & {
    slotItems: Item[];
  }
>(
  ({
    getContainer,
    getCurrentAnchor,
    children,
    items,
    slotItems,
    ...props
  }) => {
    const getContainerFunction = useFunction(getContainer);
    const getCurrentAnchorFunction = useFunction(getCurrentAnchor);
    return (
      <>
        {children}
        <AAnchor
          {...props}
          items={useMemo(() => {
            // ["title"]
            return (
              items ||
              renderItems<NonNullable<AnchorProps['items']>[number]>(slotItems)
            );
          }, [items, slotItems])}
          getContainer={getContainerFunction}
          getCurrentAnchor={getCurrentAnchorFunction}
        />
      </>
    );
  }
);

export default Anchor;
