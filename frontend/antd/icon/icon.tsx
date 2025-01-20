import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import * as icons from '@ant-design/icons';
import type { GetProps } from 'antd';

import { useIconFontContext } from './iconfont-provider/context';

export const Icon = sveltify<
  GetProps<typeof icons.default> & {
    value: string;
  }
>(({ value, ...props }) => {
  const IconFont = useIconFontContext();
  const icon = icons[value as keyof typeof icons] as React.ComponentType<
    GetProps<typeof icons.default>
  >;
  return (
    <>
      {icon ? (
        React.createElement(icon, props)
      ) : IconFont ? (
        <IconFont type={value} {...props} />
      ) : null}
    </>
  );
});

export default Icon;
