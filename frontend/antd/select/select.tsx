import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Select as ASelect } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const Select = sveltify<
  GetProps<typeof ASelect> & {
    onValueChange: (value: string | number | (string | number)[]) => void;
  },
  [
    'allowClear.clearIcon',
    'maxTagPlaceholder',
    'menuItemSelectedIcon',
    'notFoundContent',
    'removeIcon',
    'suffixIcon',
    'dropdownRender',
    'popupRender',
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
      popupRender,
      optionRender,
      tagRender,
      labelRender,
      filterSort,
      elRef,
      ...props
    }) => {
      const getPopupContainerFunction = useFunction(getPopupContainer);
      const filterOptionFunction = useFunction(filterOption);
      const dropdownRenderFunction = useFunction(dropdownRender);
      const popupRenderFunction = useFunction(popupRender);
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
              onValueChange(v as string);
              onChange?.(v, ...args);
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
                    key: 'maxTagPlaceholder',
                  })
                : props.maxTagPlaceholder
            }
            getPopupContainer={getPopupContainerFunction}
            dropdownRender={
              slots.dropdownRender
                ? renderParamsSlot({
                    slots,
                    key: 'dropdownRender',
                  })
                : dropdownRenderFunction
            }
            popupRender={
              slots.popupRender
                ? renderParamsSlot({
                    slots,
                    key: 'popupRender',
                  })
                : popupRenderFunction
            }
            optionRender={
              slots.optionRender
                ? renderParamsSlot({
                    slots,
                    key: 'optionRender',
                  })
                : optionRenderFunction
            }
            tagRender={
              slots.tagRender
                ? renderParamsSlot({
                    slots,
                    key: 'tagRender',
                  })
                : tagRenderFunction
            }
            labelRender={
              slots.labelRender
                ? renderParamsSlot({
                    slots,
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
