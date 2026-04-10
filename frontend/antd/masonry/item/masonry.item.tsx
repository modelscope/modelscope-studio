import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type MasonryProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

type MasonryItemType = NonNullable<MasonryProps['items']>[number];

export const MasonryItem = sveltify<
  Partial<MasonryItemType> & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default MasonryItem;
