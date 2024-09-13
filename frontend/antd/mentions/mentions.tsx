import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Mentions as AMentions } from 'antd';

import { type Item } from './context';

export const Mentions = sveltify<
  GetProps<typeof AMentions> & {
    optionItems: Item[];
    onValueChange: (value: string) => void;
  },
  ['allowClear.clearIcon', 'notFoundContent']
>(
  ({
    slots,
    children,
    onValueChange,
    filterOption,
    onChange,
    options,
    validateSearch,
    optionItems,
    getPopupContainer,
    elRef,
    ...props
  }) => {
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const filterOptionFunction = useFunction(filterOption);
    const validateSearchFunction = useFunction(validateSearch);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>

        <AMentions
          {...props}
          ref={elRef}
          options={useMemo(() => {
            return (
              options ||
              renderItems<
                NonNullable<GetProps<typeof AMentions>['options']>[number]
              >(optionItems)
            );
          }, [optionItems, options])}
          onChange={(v, ...args) => {
            onChange?.(v, ...args);
            onValueChange(v);
          }}
          validateSearch={validateSearchFunction}
          notFoundContent={
            slots.notFoundContent ? (
              <ReactSlot slot={slots.notFoundContent} />
            ) : (
              props.notFoundContent
            )
          }
          filterOption={filterOptionFunction || filterOption}
          getPopupContainer={getPopupContainerFunction}
        />
      </>
    );
  }
);

export default Mentions;
