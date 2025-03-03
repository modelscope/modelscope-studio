import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Input as AInput } from 'antd';

export const InputTextarea = sveltify<
  GetProps<typeof AInput.TextArea> & {
    onValueChange: (value: string) => void;
    setSlotParams: SetSlotParams;
  },
  ['allowClear.clearIcon', 'showCount.formatter']
>(
  ({
    slots,
    children,
    count,
    showCount,
    onValueChange,
    onChange,
    elRef,
    setSlotParams,
    ...props
  }) => {
    const countStrategyFunction = useFunction(count?.strategy);
    const countExceedFormatterFunction = useFunction(count?.exceedFormatter);
    const countShowFunction = useFunction(count?.show);
    const showCountFunction = useFunction(
      typeof showCount === 'object' ? showCount.formatter : undefined
    );
    const [value, setValue] = useValueChange({
      onValueChange,
      value: props.value,
    });
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <AInput.TextArea
          {...props}
          ref={elRef}
          value={value}
          onChange={(e) => {
            onChange?.(e);
            setValue(e.target.value);
          }}
          showCount={
            slots['showCount.formatter']
              ? {
                  formatter: renderParamsSlot({
                    slots,
                    setSlotParams,
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
          allowClear={
            slots['allowClear.clearIcon']
              ? {
                  clearIcon: <ReactSlot slot={slots['allowClear.clearIcon']} />,
                }
              : props.allowClear
          }
        />
      </>
    );
  }
);

export default InputTextarea;
