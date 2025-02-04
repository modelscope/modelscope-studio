import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { PromptsProps } from '@ant-design/x';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const PromptsItem = sveltify<
  Partial<NonNullable<PromptsProps['items']>[number]> & ItemHandlerProps
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

export default PromptsItem;
