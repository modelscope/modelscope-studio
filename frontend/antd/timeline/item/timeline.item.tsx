import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type TimelineItemProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const TimelineItem = sveltify<TimelineItemProps & ItemHandlerProps>(
  (props) => {
    return <ItemHandler {...props} />;
  }
);

export default TimelineItem;
