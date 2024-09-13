import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { type GetProps, List as AList } from 'antd';

export const List = sveltify<
  GetProps<typeof AList>,
  ['footer', 'header', 'loadMore']
>(({ slots, ...props }) => {
  return (
    <AList
      {...props}
      footer={slots.footer ? <ReactSlot slot={slots.footer} /> : props.footer}
      header={slots.header ? <ReactSlot slot={slots.header} /> : props.header}
      loadMore={
        slots.loadMore ? <ReactSlot slot={slots.loadMore} /> : props.loadMore
      }
    />
  );
});

export default List;
