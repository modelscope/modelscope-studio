import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { SelectProps } from 'antd/es/select';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const SelectOptions = sveltify<
  NonNullable<SelectProps['options']>[number] & ItemHandlerProps
>((props) => {
  return (
    <ItemHandler<['default', 'options']>
      {...props}
      allowedSlots={['default', 'options']}
      itemChildrenKey="options"
      itemChildren={(items) => {
        return items.options.length > 0
          ? items.options
          : items.default.length > 0
            ? items.default
            : undefined;
      }}
    />
  );
});

export default SelectOptions;
