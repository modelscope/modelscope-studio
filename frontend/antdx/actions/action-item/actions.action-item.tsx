import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { ActionsProps } from '@ant-design/x';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const ActionsActionItem = sveltify<
  Partial<NonNullable<ActionsProps['items']>[number]> & ItemHandlerProps
>((props) => {
  return (
    <ItemHandler<['default', 'subItems']>
      {...props}
      allowedSlots={['default', 'subItems']}
      itemChildrenKey="subItems"
      itemChildren={(items) => {
        return items.subItems.length > 0 ? items.subItems : items.default;
      }}
    />
  );
});

export default ActionsActionItem;
