import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type TabsProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const TabsItem = sveltify<
  Partial<NonNullable<TabsProps['items']>[number]> & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default TabsItem;
