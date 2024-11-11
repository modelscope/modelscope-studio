import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';
import { type GetProps, InputNumber as AInputNumber } from 'antd';

export const InputNumber = sveltify<
  GetProps<typeof AInputNumber> & {
    onValueChange: (value: number | string | null) => void;
  },
  [
    'addonAfter',
    'addonBefore',
    'controls.upIcon',
    'controls.downIcon',
    'prefix',
    'suffix',
  ]
>(
  ({
    slots,
    children,
    onValueChange,
    onChange,
    formatter,
    parser,
    elRef,
    ...props
  }) => {
    const formatterFunction = useFunction(formatter);
    const parserFunction = useFunction(parser);
    const [value, setValue] = useValueChange({
      onValueChange,
      value: props.value,
    });
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <AInputNumber
          {...props}
          ref={elRef}
          value={value}
          onChange={(v) => {
            onChange?.(v);
            setValue(v);
          }}
          parser={parserFunction}
          formatter={formatterFunction}
          controls={
            slots['controls.upIcon'] || slots['controls.downIcon']
              ? {
                  upIcon: slots['controls.upIcon'] ? (
                    <ReactSlot slot={slots['controls.upIcon']} />
                  ) : typeof props.controls === 'object' ? (
                    props.controls.upIcon
                  ) : undefined,
                  downIcon: slots['controls.downIcon'] ? (
                    <ReactSlot slot={slots['controls.downIcon']} />
                  ) : typeof props.controls === 'object' ? (
                    props.controls.downIcon
                  ) : undefined,
                }
              : props.controls
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

export default InputNumber;
