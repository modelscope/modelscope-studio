import { sveltify } from '@svelte-preprocess-react';
import { useIconFontContext } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import * as icons from '@ant-design/icons';
import type { GetProps } from 'antd';

() => {
  return;
};

export const Icon = sveltify<
  GetProps<typeof icons.default> & {
    value: string;
  },
  ['component']
>(({ value, slots, children, ...props }) => {
  const IconFont = useIconFontContext();
  const icon = icons[value as keyof typeof icons] as React.ComponentType<
    GetProps<typeof icons.default>
  >;

  const CustomComponentIcon = useMemo(() => {
    return (() =>
      slots.component ? (
        <ReactSlot slot={slots.component} />
      ) : null) as unknown as React.ComponentType<
      React.SVGProps<SVGSVGElement>
    >;
  }, [slots.component]);

  if (slots.component) {
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        {React.createElement(icons.default, {
          ...props,
          component: CustomComponentIcon,
        })}
      </>
    );
  }
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
