import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { SegmentedLabeledOption } from 'antd/es/segmented';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const SegmentedOption = sveltify<
  SegmentedLabeledOption & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default SegmentedOption;
