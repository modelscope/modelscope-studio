import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Tour as ATour } from 'antd';

import { type Item } from './context';

export const Tour = sveltify<
  GetProps<typeof ATour> & {
    slotItems: Item[];
    children?: React.ReactNode;
    onValueChange: (options: { current: number; open: boolean }) => void;
  },
  ['closeIcon']
>(
  ({
    slots,
    steps,
    slotItems,
    children,
    onChange,
    onClose,
    onValueChange,
    getPopupContainer,
    ...props
  }) => {
    const getPopupContainerFunction = useFunction(getPopupContainer);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ATour
          {...props}
          steps={useMemo(() => {
            return (
              steps ||
              renderItems<NonNullable<GetProps<typeof ATour>['steps']>[number]>(
                slotItems
              )
            );
          }, [steps, slotItems])}
          onChange={(current) => {
            onChange?.(current);
            onValueChange({
              open: true,
              current: current,
            });
          }}
          closeIcon={
            slots.closeIcon ? (
              <ReactSlot slot={slots.closeIcon} />
            ) : (
              props.closeIcon
            )
          }
          getPopupContainer={getPopupContainerFunction}
          onClose={(current, ...args) => {
            onClose?.(current, ...args);
            onValueChange({
              current,
              open: false,
            });
          }}
        />
      </>
    );
  }
);

export default Tour;
