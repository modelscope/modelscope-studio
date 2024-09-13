import { sveltify } from '@svelte-preprocess-react';
import { FormItemContext } from '@svelte-preprocess-react/context';
import { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Radio as ARadio } from 'antd';

import { type Item } from '../context';

import './radio.group.less';

export const RadioGroup = sveltify<
  GetProps<typeof ARadio.Group> & {
    onValueChange: (value: any) => void;
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
        <ARadio.Group
          {...props}
          ref={elRef}
          options={useMemo(() => {
            return (
              options ||
              renderItems<
                NonNullable<GetProps<typeof ARadio.Group>['options']>[number]
              >(optionItems)
            );
          }, [optionItems, options])}
          onChange={(e) => {
            onChange?.(e);
            onValueChange(e.target.value);
          }}
        >
          <FormItemContext.Provider value={null}>
            {children}
          </FormItemContext.Provider>
        </ARadio.Group>
      </>
    );
  }
);

export default RadioGroup;
