import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const AnchorItem = sveltify<AnchorLinkItemProps & ItemHandlerProps>(
  (props) => {
    return (
      <>
        <ItemHandler<['default']>
          {...props}
          allowedSlots={['default']}
          itemChildren={(items) => {
            return items.default.length > 0 ? items.default : undefined;
          }}
        />
      </>
    );
  }
);

export default AnchorItem;
