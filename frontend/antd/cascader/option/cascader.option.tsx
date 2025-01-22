import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type CascaderProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const CascaderOption = sveltify<
  Partial<NonNullable<CascaderProps['options']>[number]> & ItemHandlerProps
>((props) => {
  return (
    <ItemHandler<['default']>
      {...props}
      allowedSlots={['default']}
      itemChildren={(items) => {
        return items.default.length > 0 ? items.default : undefined;
      }}
    />
  );
});

export default CascaderOption;
