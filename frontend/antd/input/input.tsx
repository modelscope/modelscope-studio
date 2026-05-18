import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Input as AInput } from 'antd';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

export const Input = sveltify<
  GetProps<typeof AInput> & {
    onValueChange: (value: string) => void;
  },
  [
    'addonAfter',
    'addonBefore',
    'allowClear.clearIcon',
    'prefix',
    'suffix',
    'showCount.formatter',
  ]
>(
  ({
    slots,
    children,
    count,
    showCount,
    onValueChange,
    onChange,
    elRef,
    ...props
  }) => {
    const countStrategyFunction = useFunction(count?.strategy);
    const countExceedFormatterFunction = useFunction(count?.exceedFormatter);
    const countShowFunction = useFunction(count?.show);
    const showCountFunction = useFunction(
      typeof showCount === 'object' ? showCount.formatter : undefined
    );
    const allowClearConfig = getConfig(props.allowClear);
    const [value, setValue] = useValueChange({
      onValueChange,
      value: props.value,
    });

    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <AInput
          {...props}
          value={value}
          ref={elRef}
          onChange={(e) => {
            onChange?.(e);
            setValue(e.target.value);
          }}
          showCount={
            slots['showCount.formatter']
              ? {
                  formatter: renderParamsSlot({
                    slots,
                    key: 'showCount.formatter',
                  })!,
                }
              : typeof showCount === 'object' && showCountFunction
                ? {
                    ...showCount,
                    formatter: showCountFunction,
                  }
                : showCount
          }
          count={useMemo(
            () =>
              omitUndefinedProps({
                ...count,
                exceedFormatter: countExceedFormatterFunction,
                strategy: countStrategyFunction,
                show: countShowFunction || count?.show,
              }),
            [
              count,
              countExceedFormatterFunction,
              countStrategyFunction,
              countShowFunction,
            ]
          )}
          addonAfter={
            slots.addonAfter ? (
              <ReactSlot slot={slots.addonAfter} />
            ) : (
              props.addonAfter
            )
          }
          addonBefore={
            slots.addonBefore ? (
              <ReactSlot slot={slots.addonBefore} />
            ) : (
              props.addonBefore
            )
          }
          allowClear={
            slots['allowClear.clearIcon']
              ? {
                  ...allowClearConfig,
                  clearIcon: <ReactSlot slot={slots['allowClear.clearIcon']} />,
                }
              : props.allowClear
          }
          prefix={
            slots.prefix ? <ReactSlot slot={slots.prefix} /> : props.prefix
          }
          suffix={
            slots.suffix ? <ReactSlot slot={slots.suffix} /> : props.suffix
          }
        />
      </>
    );
  }
);

export default Input;
