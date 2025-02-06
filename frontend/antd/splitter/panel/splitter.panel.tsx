import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { PanelProps } from 'antd/es/splitter/interface';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const SplitterPanel = sveltify<PanelProps & ItemHandlerProps>(
  (props) => {
    return <ItemHandler {...props} />;
  }
);

export default SplitterPanel;
