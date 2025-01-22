import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type MentionsProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const MentionsOption = sveltify<
  NonNullable<MentionsProps['options']>[number] & ItemHandlerProps
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

export default MentionsOption;
