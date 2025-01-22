import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type TableColumnProps } from 'antd';

import { ColumnItemHandler, type ItemHandlerProps } from '../context';

export const TableColumnGroup = sveltify<TableColumnProps & ItemHandlerProps>(
  (props) => {
    return (
      <ColumnItemHandler<['default']>
        {...props}
        allowedSlots={['default']}
        itemChildren={(items) => {
          return items.default || [];
        }}
      />
    );
  }
);

export default TableColumnGroup;
