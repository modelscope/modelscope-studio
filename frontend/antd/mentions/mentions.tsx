import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Mentions as AMentions } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const Mentions = sveltify<
  GetProps<typeof AMentions> & {
    onValueChange: (value: string) => void;
  },
  ['allowClear.clearIcon', 'notFoundContent']
>(
  withItemsContextProvider(
    ['options', 'default'],
    ({
      slots,
      children,
      onValueChange,
      filterOption,
      onChange,
      options,
      validateSearch,
      getPopupContainer,
      elRef,
      ...props
    }) => {
      const getPopupContainerFunction = useFunction(getPopupContainer);
      const filterOptionFunction = useFunction(filterOption);
      const validateSearchFunction = useFunction(validateSearch);
      const [value, setValue] = useValueChange({
        onValueChange,
        value: props.value,
      });
      const { items: slotItems } = useItems<['options', 'default']>();
      const resolvedSlotItems =
        slotItems.options.length > 0 ? slotItems.options : slotItems.default;
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <AMentions
            {...props}
            ref={elRef}
            value={value}
            options={useMemo(() => {
              return (
                options ||
                renderItems<
                  NonNullable<GetProps<typeof AMentions>['options']>[number]
                >(resolvedSlotItems, {
                  clone: true,
                })
              );
            }, [resolvedSlotItems, options])}
            onChange={(v, ...args) => {
              onChange?.(v, ...args);
              setValue(v);
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
  )
);

export default Mentions;
