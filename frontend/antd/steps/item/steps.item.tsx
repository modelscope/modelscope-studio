import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { StepsProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const StepsItem = sveltify<
  NonNullable<StepsProps['items']>[number] & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default StepsItem;
