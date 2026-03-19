import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { SourcesProps } from '@ant-design/x';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const SourcesItem = sveltify<
  Partial<NonNullable<SourcesProps['items']>[number]> & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default SourcesItem;
