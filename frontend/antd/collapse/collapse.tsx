import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { Collapse as ACollapse, type GetProps } from 'antd';

import { type Item } from './context';

type CollapseProps = GetProps<typeof ACollapse>;
export const Collapse = sveltify<
  CollapseProps & {
    slotItems: Item[];
    onValueChange: CollapseProps['onChange'];
  },
  ['expandIcon']
>(
  ({
    slots,
    items,
    slotItems,
    children,
    onChange,
    onValueChange,
    ...props
  }) => {
    return (
      <>
        {children}
        <ACollapse
          {...props}
          onChange={(key) => {
            onValueChange?.(key);
            onChange?.(key);
          }}
          expandIcon={
            slots.expandIcon
              ? () =>
                  slots.expandIcon ? (
                    <ReactSlot slot={slots.expandIcon} />
                  ) : null
              : props.expandIcon
          }
          items={useMemo(() => {
            // ['label','extra', 'children']
            return (
              items ||
              renderItems<NonNullable<CollapseProps['items']>[number]>(
                slotItems
              )
            );
          }, [items, slotItems])}
        />
      </>
    );
  }
);

export default Collapse;
