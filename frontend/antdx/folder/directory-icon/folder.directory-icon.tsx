import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { TreeNodeProps } from 'antd';

import { DirectoryIconItemHandler, type ItemHandlerProps } from '../context';

export const FolderDirectoryIcon = sveltify<TreeNodeProps & ItemHandlerProps>(
  (props) => {
    return <DirectoryIconItemHandler {...props} />;
  }
);

export default FolderDirectoryIcon;
