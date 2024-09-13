import { sveltify } from '@svelte-preprocess-react';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Input as AInput } from 'antd';

export const InputOTP = sveltify<
  GetProps<typeof AInput.OTP> & {
    onValueChange: (value: string) => void;
  }
>(({ formatter, onValueChange, onChange, elRef, ...props }) => {
  const formatterFunction = useFunction(formatter);
  return (
    <AInput.OTP
      {...props}
      ref={elRef}
      formatter={formatterFunction}
      onChange={(v) => {
        onChange?.(v);
        onValueChange(v);
      }}
    />
  );
});

export default InputOTP;
