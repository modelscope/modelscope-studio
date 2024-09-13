import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { type GetProps, Rate as ARate } from 'antd';

export const Rate = sveltify<
  GetProps<typeof ARate> & {
    onValueChange: (value: number) => void;
    children?: React.ReactNode;
  },
  ['character']
>(
  ({
    slots,
    children,
    onValueChange,
    character,
    onChange,
    elRef,
    ...props
  }) => {
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ARate
          {...props}
          ref={elRef}
          onChange={(v) => {
            onChange?.(v);
            onValueChange(v);
          }}
          character={
            slots.character ? <ReactSlot slot={slots.character} /> : character
          }
        />
      </>
    );
  }
);

export default Rate;
