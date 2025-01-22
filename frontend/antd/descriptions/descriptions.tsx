import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { Descriptions as ADescriptions, type GetProps } from 'antd';

import { useItems, withItemsContextProvider } from './context';

type DescriptionsProps = GetProps<typeof ADescriptions>;
export const Descriptions = sveltify<DescriptionsProps, ['extra', 'title']>(
  withItemsContextProvider(
    ['default', 'items'],
    ({ slots, items, children, ...props }) => {
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <ADescriptions
            {...props}
            extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
            title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
            items={useMemo(() => {
              // ['label', 'children']
              return (
                items ||
                renderItems<NonNullable<DescriptionsProps['items']>[number]>(
                  resolvedSlotItems
                )
              );
            }, [items, resolvedSlotItems])}
          />
        </>
      );
    }
  )
);

export default Descriptions;
