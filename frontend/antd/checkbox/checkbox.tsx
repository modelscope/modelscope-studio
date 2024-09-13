import { sveltify } from '@svelte-preprocess-react';
import { Checkbox as ACheckbox, type GetProps } from 'antd';

export const Checkbox = sveltify<
  GetProps<typeof ACheckbox> & {
    onValueChange: (value: boolean) => void;
  }
>(({ onValueChange, onChange, elRef, ...props }) => {
  return (
    <ACheckbox
      {...props}
      ref={elRef}
      onChange={(e) => {
        onChange?.(e);
        onValueChange(e.target.checked);
      }}
    />
  );
});

export default Checkbox;
