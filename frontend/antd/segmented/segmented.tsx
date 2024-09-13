import { sveltify } from '@svelte-preprocess-react';
import { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Segmented as ASegmented } from 'antd';

import type { Item } from './context';

type SegmentedProps = GetProps<typeof ASegmented>;
export const Segmented = sveltify<
  SegmentedProps & {
    slotItems: Item[];
    onValueChange: (value: string | number) => void;
  }
>(({ slotItems, options, onChange, onValueChange, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <ASegmented
        {...props}
        onChange={(v) => {
          onChange?.(v);
          onValueChange(v as string | number);
        }}
        options={useMemo(() => {
          // ['label','icon']
          return (
            options || renderItems<SegmentedProps['options'][number]>(slotItems)
          );
        }, [options, slotItems])}
      />
    </>
  );
});

export default Segmented;
