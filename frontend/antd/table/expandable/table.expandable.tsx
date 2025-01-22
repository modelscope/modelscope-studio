import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type TableProps } from 'antd';

import { ExpandableItemHandler, type ItemHandlerProps } from '../context';

export const TableExpandable = sveltify<
  TableProps['expandable'] & ItemHandlerProps
>((props) => {
  return <ExpandableItemHandler {...props} />;
});

export default TableExpandable;
