import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { BubbleProps } from '@ant-design/x';

import { type ItemHandlerProps, RoleItemHandler } from '../context';

export const BubbleListRole = sveltify<BubbleProps & ItemHandlerProps>(
  (props) => {
    return <RoleItemHandler {...props} />;
  }
);

export default BubbleListRole;
