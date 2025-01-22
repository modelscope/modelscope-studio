import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type DatePickerProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const DatePickerPreset = sveltify<
  Partial<NonNullable<DatePickerProps['presets']>[number]> & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default DatePickerPreset;
