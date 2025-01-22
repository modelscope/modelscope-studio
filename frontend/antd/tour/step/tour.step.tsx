import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type TourStepProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const TourStep = sveltify<Partial<TourStepProps> & ItemHandlerProps>(
  (props) => {
    return <ItemHandler {...props} />;
  }
);

export default TourStep;
