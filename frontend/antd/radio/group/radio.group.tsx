import { sveltify } from '@svelte-preprocess-react';
import { FormItemContext } from '@svelte-preprocess-react/context';
import { useMemo } from 'react';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Radio as ARadio } from 'antd';

import { useItems, withItemsContextProvider } from '../context';

export const RadioGroup = sveltify<
  GetProps<typeof ARadio.Group> & {
    onValueChange: (value: any) => void;
  }
>(
  withItemsContextProvider(
    ['options'],
    ({ onValueChange, onChange, elRef, options, children, ...props }) => {
      const {
        items: { options: optionItems },
      } = useItems<['options']>();
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
  )
);

export default RadioGroup;
