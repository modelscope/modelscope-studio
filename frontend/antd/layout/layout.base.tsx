import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { type GetProps, Layout as ALayout } from 'antd';
import cls from 'classnames';

export const Base = sveltify<
  GetProps<typeof ALayout> &
    GetProps<typeof ALayout.Content> &
    GetProps<typeof ALayout.Footer> &
    GetProps<typeof ALayout.Header> & {
      component?: 'header' | 'footer' | 'content' | 'layout';
    }
>(({ component, className, ...props }) => {
  const LayoutComponent = useMemo(() => {
    switch (component) {
      case 'content':
        return ALayout.Content;
      case 'footer':
        return ALayout.Footer;
      case 'header':
        return ALayout.Header;
      case 'layout':
        return ALayout;
      default:
        return ALayout;
    }
  }, [component]);
  return (
    <LayoutComponent
      {...props}
      className={cls(
        className,
        component === 'layout' ? null : `ms-gr-antd-layout-${component}`
      )}
    />
  );
});

export default Base;
