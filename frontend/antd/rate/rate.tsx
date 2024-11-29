import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Rate as ARate } from 'antd';

export const Rate = sveltify<
  GetProps<typeof ARate> & {
    onValueChange: (value: number) => void;
    children?: React.ReactNode;
    setSlotParams: SetSlotParams;
  },
  ['character']
>(
  ({
    slots,
    children,
    onValueChange,
    character,
    onChange,
    setSlotParams,
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
            onChange?.(v);
            onValueChange(v);
          }}
          character={
            slots.character
              ? renderParamsSlot({ slots, setSlotParams, key: 'character' })
              : characterFunction || character
          }
        />
      </>
    );
  }
);

export default Rate;
