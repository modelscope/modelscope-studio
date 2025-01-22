import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { SelectionItem } from 'antd/es/table/interface';

import { type ItemHandlerProps, SelectionItemHandler } from '../../context';

export const TableRowSelectionSelection = sveltify<
  Partial<SelectionItem> & ItemHandlerProps
>((props) => {
  return <SelectionItemHandler {...props} />;
});

export default TableRowSelectionSelection;
