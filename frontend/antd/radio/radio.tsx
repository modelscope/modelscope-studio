import { sveltify } from '@svelte-preprocess-react';
import { type GetProps, Radio as ARadio } from 'antd';

export const Radio = sveltify<
  GetProps<typeof ARadio> & {
    onValueChange: (value: boolean) => void;
  }
>(({ onValueChange, onChange, elRef, ...props }) => {
  return (
    <ARadio
      {...props}
      ref={elRef}
      onChange={(e) => {
        onChange?.(e);
        onValueChange(e.target.checked);
      }}
    />
  );
});

export default Radio;
