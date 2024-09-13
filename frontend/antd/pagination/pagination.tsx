import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Pagination as APagination } from 'antd';

export const Pagination = sveltify<
  GetProps<typeof APagination> & {
    onValueChange: (page: number, pageSize: number) => void;
  },
  ['showQuickJumper.goButton']
>(
  ({
    slots,
    onValueChange,
    showTotal,
    showQuickJumper,
    onChange,
    ...props
  }) => {
    const showTotalFunction = useFunction(showTotal);
    return (
      <APagination
        {...props}
        showTotal={showTotal ? showTotalFunction : undefined}
        onChange={(page, pageSize) => {
          onValueChange(page, pageSize);
          onChange?.(page, pageSize);
        }}
        showQuickJumper={
          slots['showQuickJumper.goButton']
            ? {
                goButton: (
                  <ReactSlot slot={slots['showQuickJumper.goButton']} />
                ),
              }
            : showQuickJumper
        }
      />
    );
  }
);

export default Pagination;
