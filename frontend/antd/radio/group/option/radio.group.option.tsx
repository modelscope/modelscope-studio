import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type CheckboxOptionType } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../../context';

export const RadioGroupOption = sveltify<CheckboxOptionType & ItemHandlerProps>(
  (props) => {
    return <ItemHandler {...props} />;
  }
);

export default RadioGroupOption;
