import { sveltify } from '@svelte-preprocess-react';
import React from 'react';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const SliderMark = sveltify<ItemHandlerProps>((props) => {
  return <ItemHandler {...props} />;
});

export default SliderMark;
