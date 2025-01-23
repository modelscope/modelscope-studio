import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Select as ASelect } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const Select = sveltify<
  GetProps<typeof ASelect> & {
    onValueChange: (value: string | number | (string | number)[]) => void;
    setSlotParams: SetSlotParams;
  },
  [
    'allowClear.clearIcon',
    'maxTagPlaceholder',
    'menuItemSelectedIcon',
    'notFoundContent',
    'removeIcon',
    'suffixIcon',
    'dropdownRender',
    'optionRender',
    'tagRender',
    'labelRender',
    'prefix',
  ]
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
      getPopupContainer,
      dropdownRender,
      optionRender,
      tagRender,
      labelRender,
      filterSort,
      elRef,
      setSlotParams,
      ...props
    }) => {
      const getPopupContainerFunction = useFunction(getPopupContainer);
      const filterOptionFunction = useFunction(filterOption);
      const dropdownRenderFunction = useFunction(dropdownRender);
      const filterSortFunction = useFunction(filterSort);
      const optionRenderFunction = useFunction(optionRender);
      const tagRenderFunction = useFunction(tagRender);
      const labelRenderFunction = useFunction(labelRender);
      const { items: slotItems } = useItems<['options', 'default']>();
      const resolvedSlotItems =
        slotItems.options.length > 0 ? slotItems.options : slotItems.default;
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>

          <ASelect
            {...props}
            ref={elRef}
            options={useMemo(() => {
              return (
                options ||
                renderItems<
                  NonNullable<GetProps<typeof ASelect>['options']>[number]
                >(resolvedSlotItems, {
                  children: 'options',
                  clone: true,
                })
              );
            }, [resolvedSlotItems, options])}
            onChange={(v, ...args) => {
              onChange?.(v, ...args);
              onValueChange(v as string);
            }}
            allowClear={
              slots['allowClear.clearIcon']
                ? {
                    clearIcon: (
                      <ReactSlot slot={slots['allowClear.clearIcon']} />
                    ),
                  }
                : props.allowClear
            }
            prefix={
              slots.prefix ? <ReactSlot slot={slots.prefix} /> : props.prefix
            }
            removeIcon={
              slots.removeIcon ? (
                <ReactSlot slot={slots.removeIcon} />
              ) : (
                props.removeIcon
              )
            }
            suffixIcon={
              slots.suffixIcon ? (
                <ReactSlot slot={slots.suffixIcon} />
              ) : (
                props.suffixIcon
              )
            }
            notFoundContent={
              slots.notFoundContent ? (
                <ReactSlot slot={slots.notFoundContent} />
              ) : (
                props.notFoundContent
              )
            }
            menuItemSelectedIcon={
              slots['menuItemSelectedIcon'] ? (
                <ReactSlot slot={slots['menuItemSelectedIcon']} />
              ) : (
                props.menuItemSelectedIcon
              )
            }
            filterOption={filterOptionFunction || filterOption}
            maxTagPlaceholder={
              slots.maxTagPlaceholder
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'maxTagPlaceholder',
                  })
                : props.maxTagPlaceholder
            }
            getPopupContainer={getPopupContainerFunction}
            dropdownRender={
              slots.dropdownRender
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'dropdownRender',
                  })
                : dropdownRenderFunction
            }
            optionRender={
              slots.optionRender
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'optionRender',
                  })
                : optionRenderFunction
            }
            tagRender={
              slots.tagRender
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'tagRender',
                  })
                : tagRenderFunction
            }
            labelRender={
              slots.labelRender
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'labelRender',
                  })
                : labelRenderFunction
            }
            filterSort={filterSortFunction}
          />
        </>
      );
    }
  )
);

export default Select;
