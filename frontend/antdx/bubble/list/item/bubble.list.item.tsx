import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { BubbleProps } from '@ant-design/x';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const BubbleListItem = sveltify<BubbleProps & ItemHandlerProps>(
  (props) => {
    return <ItemHandler {...props} />;
  }
);

export default BubbleListItem;
