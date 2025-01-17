import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, List as AList } from 'antd';

export const List = sveltify<
  GetProps<typeof AList> & {
    setSlotParams: SetSlotParams;
  },
  ['footer', 'header', 'loadMore', 'renderItem']
>(({ slots, renderItem, setSlotParams, ...props }) => {
  const renderItemFunction = useFunction(renderItem);
  return (
    <AList
      {...props}
      footer={slots.footer ? <ReactSlot slot={slots.footer} /> : props.footer}
      header={slots.header ? <ReactSlot slot={slots.header} /> : props.header}
      loadMore={
        slots.loadMore ? <ReactSlot slot={slots.loadMore} /> : props.loadMore
      }
      renderItem={
        slots.renderItem
          ? renderParamsSlot(
              { slots, setSlotParams, key: 'renderItem' },
              {
                forceClone: true,
              }
            )
          : renderItemFunction
      }
    />
  );
});

export default List;
