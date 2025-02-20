import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { Divider as ADivider, type GetProps } from 'antd';

export const Divider = sveltify<GetProps<typeof ADivider>>(
  ({ children, ...props }) => {
    if (React.Children.count(children) > 0) {
      return <ADivider {...props}>{children}</ADivider>;
    }
    return <ADivider {...props} />;
  }
);

export default Divider;
