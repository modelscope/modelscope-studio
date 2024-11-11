import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { Descriptions as ADescriptions, type GetProps } from 'antd';

import { type Item } from './context';

type DescriptionsProps = GetProps<typeof ADescriptions>;
export const Descriptions = sveltify<
  DescriptionsProps & {
    slotItems: Item[];
  },
  ['extra', 'title']
>(({ slots, items, slotItems, children, ...props }) => {
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
              slotItems
            )
          );
        }, [items, slotItems])}
      />
    </>
  );
});

export default Descriptions;
