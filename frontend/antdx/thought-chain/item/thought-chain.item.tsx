import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { ThoughtChainProps } from '@ant-design/x';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const ThoughtChainItem = sveltify<
  Partial<NonNullable<ThoughtChainProps['items']>[number]> & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default ThoughtChainItem;
