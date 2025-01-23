import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type CollapseProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const CollapseItem = sveltify<
  Partial<NonNullable<CollapseProps['items']>[number]> & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default CollapseItem;
