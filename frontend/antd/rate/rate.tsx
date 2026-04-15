import { sveltify } from '@svelte-preprocess-react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
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
    const characterFunction = useFunction(character, true);

    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ARate
          {...props}
          ref={elRef}
          onChange={(v) => {
            onValueChange(v);
            onChange?.(v);
          }}
          character={
            slots.character
              ? renderParamsSlot({ slots, key: 'character' })
              : characterFunction || character
          }
        />
      </>
    );
  }
);

export default Rate;
