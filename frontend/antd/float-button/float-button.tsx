import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { FloatButton as AFloatButton, type GetProps } from 'antd';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

export const FloatButton = sveltify<
  GetProps<typeof AFloatButton> & {
    id?: string;
  },
  ['icon', 'description', 'tooltip', 'tooltip.title', 'badge.count']
>(({ slots, children, tooltip, ...props }) => {
  const supportTooltipConfig =
    slots['tooltip.title'] || typeof tooltip === 'object';
  const tooltipConfig = getConfig(tooltip);
  const tooltipAfterOpenChangeFunction = useFunction(
    tooltipConfig.afterOpenChange
  );
  const tooltipGetPopupContainerFunction = useFunction(
    tooltipConfig.getPopupContainer
  );

  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <AFloatButton
        {...props}
        icon={slots.icon ? <ReactSlot clone slot={slots.icon} /> : props.icon}
        description={
          slots.description ? (
            <ReactSlot clone slot={slots.description} />
          ) : (
            props.description
          )
        }
        tooltip={
          slots['tooltip'] ? (
            <ReactSlot slot={slots['tooltip']} />
          ) : supportTooltipConfig ? (
            {
              ...tooltipConfig,
              afterOpenChange: tooltipAfterOpenChangeFunction,
              getPopupContainer: tooltipGetPopupContainerFunction,
              title: slots['tooltip.title'] ? (
                <ReactSlot slot={slots['tooltip.title']} />
              ) : (
                tooltipConfig.title
              ),
            }
          ) : (
            tooltip
          )
        }
        badge={{
          ...props.badge,
          count: slots['badge.count'] ? (
            <ReactSlot slot={slots['badge.count']} />
          ) : (
            props.badge?.count
          ),
        }}
      />
    </>
  );
});

export default FloatButton;
