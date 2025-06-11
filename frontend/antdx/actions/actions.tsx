import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { Actions as XActions, type ActionsProps } from '@ant-design/x';
import type { ActionItem } from '@ant-design/x/es/actions/interface';
import { renderItems } from '@utils/renderItems';
import classNames from 'classnames';

import { useItems, withItemsContextProvider } from './context';

export const Actions = sveltify<Partial<ActionsProps>>(
  withItemsContextProvider(
    ['default', 'items'],
    ({ children, items, className, ...props }) => {
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;

      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <XActions
            {...props}
            rootClassName={classNames(className, props.rootClassName)}
            items={useMemo(() => {
              return (
                items ||
                renderItems<ActionItem>(resolvedSlotItems, {
                  clone: true,
                }) ||
                []
              );
            }, [items, resolvedSlotItems])}
          />
        </>
      );
    }
  )
);

export default Actions;
