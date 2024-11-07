import { sveltify } from '@svelte-preprocess-react';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';
import { type GetProps, Input as AInput } from 'antd';

export const InputOTP = sveltify<
  GetProps<typeof AInput.OTP> & {
    onValueChange: (value: string) => void;
  }
>(({ formatter, onValueChange, onChange, elRef, ...props }) => {
  const formatterFunction = useFunction(formatter);
  const [value, setValue] = useValueChange({
    onValueChange,
    value: props.value,
  });

  return (
    <AInput.OTP
      {...props}
      value={value}
      ref={elRef}
      formatter={formatterFunction}
      onChange={(v) => {
        onChange?.(v);
        setValue(v);
      }}
    />
  );
});

export default InputOTP;
