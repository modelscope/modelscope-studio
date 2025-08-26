import { sveltify } from '@svelte-preprocess-react';
import { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { Checkbox as ACheckbox, type GetProps } from 'antd';

import { useItems, withItemsContextProvider } from '../context';

export const CheckboxGroup = sveltify<
  GetProps<typeof ACheckbox.Group> & {
    onValueChange: (value: (string | number | boolean)[]) => void;
  }
>(
  withItemsContextProvider(
    ['default', 'options'],
    ({ onValueChange, onChange, elRef, options, children, ...props }) => {
      const { items: slotItems } = useItems<['default', 'options']>();
      const resolvedSlotItems =
        slotItems.options.length > 0 ? slotItems.options : slotItems.default;

      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <ACheckbox.Group
            {...props}
            ref={elRef}
            options={useMemo(() => {
              return (
                options ||
                renderItems<
                  NonNullable<
                    GetProps<typeof ACheckbox.Group>['options']
                  >[number]
                >(resolvedSlotItems)
              );
            }, [resolvedSlotItems, options])}
            onChange={(v: any[]) => {
              onChange?.(v);
              onValueChange(v);
            }}
          />
        </>
      );
    }
  )
);

export default CheckboxGroup;
