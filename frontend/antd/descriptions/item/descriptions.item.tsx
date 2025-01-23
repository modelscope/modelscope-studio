import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { DescriptionsItemType } from 'antd/es/descriptions';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const DescriptionsItem = sveltify<
  DescriptionsItemType & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default DescriptionsItem;
