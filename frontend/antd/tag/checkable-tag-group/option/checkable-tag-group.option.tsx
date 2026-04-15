import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { CheckableTagGroupProps } from 'antd/es/tag';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const CheckableTagGroupOption = sveltify<
  NonNullable<CheckableTagGroupProps<any>['options']>[number] & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default CheckableTagGroupOption;
