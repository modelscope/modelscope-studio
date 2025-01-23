import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type Col as ACol, type GetProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const Col = sveltify<GetProps<typeof ACol> & ItemHandlerProps>(
  (props) => {
    return <ItemHandler {...props} />;
  }
);

export default Col;
