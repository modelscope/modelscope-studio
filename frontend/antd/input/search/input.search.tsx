import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Input as AInput } from 'antd';

export const InputSearch = sveltify<
  GetProps<typeof AInput.Search> & {
    onValueChange: (value: string) => void;
  },
  [
    'addonAfter',
    'addonBefore',
    'allowClear.clearIcon',
    'prefix',
    'suffix',
    'enterButton',
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

    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <AInput.Search
          {...props}
          ref={elRef}
          onChange={(e) => {
            onChange?.(e);
            onValueChange(e.target.value);
          }}
          showCount={
            typeof showCount === 'object' && showCountFunction
              ? {
                  formatter: showCountFunction,
                }
              : showCount
          }
          count={{
            ...count,
            exceedFormatter: countExceedFormatterFunction,
            strategy: countStrategyFunction,
            show: countShowFunction || count?.show,
          }}
          enterButton={
            slots.enterButton ? (
              <ReactSlot slot={slots.enterButton} />
            ) : (
              props.enterButton
            )
          }
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

export default InputSearch;
