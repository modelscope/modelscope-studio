import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type ColorPickerProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const ColorPickerPreset = sveltify<
  Partial<NonNullable<ColorPickerProps['presets']>[number]> & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default ColorPickerPreset;
