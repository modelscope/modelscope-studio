import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import * as icons from '@ant-design/icons';
import type { GetProps } from 'antd';

export const Icon = sveltify<
  GetProps<typeof icons.default> & {
    name: string;
    Iconfont?: ReturnType<typeof icons.createFromIconfontCN>;
  }
>(({ name, Iconfont, ...props }) => {
  const icon = icons[name as keyof typeof icons] as React.ComponentType<
    GetProps<typeof icons.default>
  >;

  return (
    <>
      {icon ? (
        React.createElement(icon, props)
      ) : Iconfont ? (
        <Iconfont type={name} {...props} />
      ) : null}
    </>
  );
});

export default Icon;
