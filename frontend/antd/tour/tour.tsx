import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Tour as ATour } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const Tour = sveltify<
  GetProps<typeof ATour> & {
    children?: React.ReactNode;
    setSlotParams: SetSlotParams;
  },
  ['closeIcon', 'indicatorsRender']
>(
  withItemsContextProvider(
    ['steps', 'default'],
    ({
      slots,
      steps,
      children,
      onChange,
      onClose,
      getPopupContainer,
      setSlotParams,
      indicatorsRender,
      ...props
    }) => {
      const getPopupContainerFunction = useFunction(getPopupContainer);
      const indicatorsRenderFunction = useFunction(indicatorsRender);
      const { items: slotItems } = useItems<['steps', 'default']>();
      const resolvedSlotItems =
        slotItems.steps.length > 0 ? slotItems.steps : slotItems.default;
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <ATour
            {...props}
            steps={useMemo(() => {
              return (
                steps ||
                renderItems<
                  NonNullable<GetProps<typeof ATour>['steps']>[number]
                >(resolvedSlotItems)
              );
            }, [steps, resolvedSlotItems])}
            onChange={(current) => {
              onChange?.(current);
            }}
            closeIcon={
              slots.closeIcon ? (
                <ReactSlot slot={slots.closeIcon} />
              ) : (
                props.closeIcon
              )
            }
            indicatorsRender={
              slots.indicatorsRender
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'indicatorsRender',
                  })
                : indicatorsRenderFunction
            }
            getPopupContainer={getPopupContainerFunction}
            onClose={(current, ...args) => {
              onClose?.(current, ...args);
            }}
          />
        </>
      );
    }
  )
);

export default Tour;
