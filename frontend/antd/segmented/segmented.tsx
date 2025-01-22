import { sveltify } from '@svelte-preprocess-react';
import { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Segmented as ASegmented } from 'antd';

import { useItems, withItemsContextProvider } from './context';

type SegmentedProps = GetProps<typeof ASegmented>;
export const Segmented = sveltify<
  SegmentedProps & {
    onValueChange: (value: string | number) => void;
  }
>(
  withItemsContextProvider(
    ['options', 'default'],
    ({ options, onChange, onValueChange, children, ...props }) => {
      const { items: slotItems } = useItems<['options', 'default']>();
      const resolvedSlotItems =
        slotItems.options.length > 0 ? slotItems.options : slotItems.default;
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
                options ||
                renderItems<SegmentedProps['options'][number]>(
                  resolvedSlotItems
                )
              );
            }, [options, resolvedSlotItems])}
          />
        </>
      );
    }
  )
);

export default Segmented;
