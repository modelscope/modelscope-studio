import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { TreeNodeProps } from 'antd';

import { type ItemHandlerProps, TreeNodeItemHandler } from '../context';

export const FolderTreeNode = sveltify<TreeNodeProps & ItemHandlerProps>(
  (props) => {
    return (
      <TreeNodeItemHandler<['default']>
        {...props}
        allowedSlots={['default']}
        itemChildren={(items) => {
          return items.default.length > 0 ? items.default : undefined;
        }}
      />
    );
  }
);

export default FolderTreeNode;
