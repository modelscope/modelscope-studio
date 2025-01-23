import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { TreeNodeProps } from 'antd';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const TreeSelectTreeNode = sveltify<TreeNodeProps & ItemHandlerProps>(
  (props) => {
    return (
      <ItemHandler<['default']>
        {...props}
        allowedSlots={['default']}
        itemChildren={(items) => {
          return items.default.length > 0 ? items.default : undefined;
        }}
      />
    );
  }
);

export default TreeSelectTreeNode;
