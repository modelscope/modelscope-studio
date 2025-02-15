import { sveltify } from '@svelte-preprocess-react';
import { FormItemContext } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { Form as AForm, type GetProps } from 'antd';

import { useRuleItems, withRuleItemsContextProvider } from '../context';

import { createRule } from './utils';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

const FormItemWrapper: React.FC<{
  children?: React.ReactNode;
}> = ({ children, ...props }) => {
  return (
    <FormItemContext.Provider
      value={useMemo(() => {
        return props;
      }, [props])}
    >
      {children}
    </FormItemContext.Provider>
  );
};

export const FormItem = sveltify<
  GetProps<typeof AForm.Item>,
  ['extra', 'help', 'label', 'tooltip', 'tooltip.title', 'tooltip.icon']
>(
  withRuleItemsContextProvider(
    ['rules'],
    ({
      slots,
      getValueFromEvent,
      getValueProps,
      normalize,
      shouldUpdate,
      tooltip,
      rules,
      children,
      hasFeedback,
      ...props
    }) => {
      const supportTooltipConfig =
        slots['tooltip.icon'] ||
        slots['tooltip.title'] ||
        typeof tooltip === 'object';
      const supportHasFeedbackConfig = typeof hasFeedback === 'object';
      const hasFeedbackConfig = getConfig(hasFeedback);
      const hasFeedbackIconsFunction = useFunction(hasFeedbackConfig.icons);
      const getValueFromEventFunction = useFunction(getValueFromEvent);
      const getValuePropsFunction = useFunction(getValueProps);
      const normalizeFunction = useFunction(normalize);
      const shouldUpdateFunction = useFunction(shouldUpdate);

      const tooltipConfig = getConfig(tooltip);
      const tooltipAfterOpenChangeFunction = useFunction(
        tooltipConfig.afterOpenChange
      );
      const tooltipGetPopupContainerFunction = useFunction(
        tooltipConfig.getPopupContainer
      );

      const {
        items: { rules: ruleItems },
      } = useRuleItems();

      return (
        <AForm.Item
          {...props}
          hasFeedback={
            supportHasFeedbackConfig
              ? {
                  ...hasFeedbackConfig,
                  icons: hasFeedbackIconsFunction || hasFeedbackConfig.icons,
                }
              : hasFeedback
          }
          getValueFromEvent={getValueFromEventFunction}
          getValueProps={getValuePropsFunction}
          normalize={normalizeFunction}
          shouldUpdate={shouldUpdateFunction || shouldUpdate}
          rules={useMemo(() => {
            return (
              rules ||
              renderItems<
                NonNullable<GetProps<typeof AForm.Item>['rules']>[number]
              >(ruleItems)
            )?.map((rule) => createRule(rule));
          }, [ruleItems, rules])}
          tooltip={
            slots['tooltip'] ? (
              <ReactSlot slot={slots['tooltip']} />
            ) : supportTooltipConfig ? (
              {
                ...tooltipConfig,
                afterOpenChange: tooltipAfterOpenChangeFunction,
                getPopupContainer: tooltipGetPopupContainerFunction,
                icon: slots['tooltip.icon'] ? (
                  <ReactSlot slot={slots['tooltip.icon']} />
                ) : (
                  tooltipConfig.icon
                ),
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
          extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
          help={slots.help ? <ReactSlot slot={slots.help} /> : props.help}
          label={slots.label ? <ReactSlot slot={slots.label} /> : props.label}
        >
          {shouldUpdateFunction || shouldUpdate ? (
            () => (
              <FormItemWrapper>{children as React.ReactNode}</FormItemWrapper>
            )
          ) : (
            <FormItemWrapper>{children as React.ReactNode}</FormItemWrapper>
          )}
        </AForm.Item>
      );
    }
  )
);

export default FormItem;
