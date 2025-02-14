import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Input as AInput } from 'antd';

export const InputOTP = sveltify<
  GetProps<typeof AInput.OTP> & {
    onValueChange: (value: string) => void;
    setSlotParams: SetSlotParams;
  },
  ['separator']
>(
  ({
    formatter,
    onValueChange,
    onChange,
    children,
    setSlotParams,
    elRef,
    slots,
    separator,
    ...props
  }) => {
    const formatterFunction = useFunction(formatter);
    const separatorFunction = useFunction(separator, true);
    const [value, setValue] = useValueChange({
      onValueChange,
      value: props.value,
    });

    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <AInput.OTP
          {...props}
          value={value}
          ref={elRef}
          formatter={formatterFunction}
          separator={
            slots.separator
              ? renderParamsSlot({
                  slots,
                  setSlotParams,
                  key: 'separator',
                })
              : separatorFunction || separator
          }
          onChange={(v) => {
            onChange?.(v);
            setValue(v);
          }}
        />
      </>
    );
  }
);

export default InputOTP;
