import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { StepProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const StepsItem = sveltify<StepProps & ItemHandlerProps>((props) => {
  return <ItemHandler {...props} />;
});

export default StepsItem;
