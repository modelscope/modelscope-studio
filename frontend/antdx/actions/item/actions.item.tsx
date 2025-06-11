import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { ActionsProps } from '@ant-design/x';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const ActionsItem = sveltify<
  Partial<NonNullable<ActionsProps['items']>[number]> & ItemHandlerProps
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

export default ActionsItem;
