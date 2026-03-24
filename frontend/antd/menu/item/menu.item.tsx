import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type MenuItemProps } from 'antd';
import type { SubMenuProps } from 'antd/lib/menu';
import cls from 'classnames';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const MenuItem = sveltify<
  MenuItemProps & SubMenuProps & ItemHandlerProps
>((props) => {
  return (
    <ItemHandler<['default']>
      {...props}
      allowedSlots={['default']}
      itemProps={(itemProps, items) => {
        return {
          ...itemProps,
          className: cls(
            itemProps.className,
            itemProps.type
              ? `ms-gr-antd-menu-item-${itemProps.type}`
              : 'ms-gr-antd-menu-item',
            items.default.length > 0 ? 'ms-gr-antd-menu-item-submenu' : ''
          ),
        };
      }}
      itemChildren={(items) => {
        return items.default.length > 0 ? items.default : undefined;
      }}
    />
  );
});

export default MenuItem;
