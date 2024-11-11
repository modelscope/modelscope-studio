import { sveltify } from '@svelte-preprocess-react';
import { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { Checkbox as ACheckbox, type GetProps } from 'antd';

import { type Item } from '../context';

export const CheckboxGroup = sveltify<
  GetProps<typeof ACheckbox.Group> & {
    onValueChange: (value: (string | number | boolean)[]) => void;
    optionItems: Item[];
  }
>(
  ({
    onValueChange,
    onChange,
    elRef,
    optionItems,
    options,
    children,
    ...props
  }) => {
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
                NonNullable<GetProps<typeof ACheckbox.Group>['options']>[number]
              >(optionItems)
            );
          }, [optionItems, options])}
          onChange={(v: any[]) => {
            onChange?.(v);
            onValueChange(v);
          }}
        />
      </>
    );
  }
);

export default CheckboxGroup;
