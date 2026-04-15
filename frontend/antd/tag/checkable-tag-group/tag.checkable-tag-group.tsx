import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Tag as ATag } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const CheckableTagGroup = sveltify<
  GetProps<typeof ATag.CheckableTagGroup> & {
    onValueChange: (value: any) => void;
    children?: React.ReactNode;
  }
>(
  withItemsContextProvider(
    ['options', 'default'],
    ({ onChange, onValueChange, children, elRef, options, ...props }) => {
      const { items: slotItems } = useItems<['options', 'default']>();
      const resolvedSlotItems =
        slotItems.options.length > 0 ? slotItems.options : slotItems.default;
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <ATag.CheckableTagGroup
            {...(props as any)}
            ref={elRef}
            options={useMemo(() => {
              return (
                options ||
                renderItems<
                  NonNullable<
                    GetProps<typeof ATag.CheckableTagGroup>['options']
                  >[number]
                >(resolvedSlotItems, {
                  children: 'options',
                  clone: true,
                })
              );
            }, [resolvedSlotItems, options])}
            onChange={(v) => {
              onValueChange(v);
              onChange?.(v as any);
            }}
          />
        </>
      );
    }
  )
);

export default CheckableTagGroup;
