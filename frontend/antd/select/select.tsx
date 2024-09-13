import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Select as ASelect } from 'antd';

import { type Item } from './context';

export const Select = sveltify<
  GetProps<typeof ASelect> & {
    optionItems: Item[];
    onValueChange: (value: string | number | (string | number)[]) => void;
  },
  [
    'allowClear.clearIcon',
    'maxTagPlaceholder',
    'menuItemSelectedIcon',
    'notFoundContent',
    'removeIcon',
    'suffixIcon',
  ]
>(
  ({
    slots,
    children,
    onValueChange,
    filterOption,
    onChange,
    options,
    optionItems,
    getPopupContainer,
    dropdownRender,
    optionRender,
    tagRender,
    labelRender,
    filterSort,
    maxTagPlaceholder,
    elRef,
    ...props
  }) => {
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const filterOptionFunction = useFunction(filterOption);
    const dropdownRenderFunction = useFunction(dropdownRender);
    const filterSortFunction = useFunction(filterSort);
    const optionRenderFunction = useFunction(optionRender);
    const tagRenderFunction = useFunction(tagRender);
    const labelRenderFunction = useFunction(labelRender);
    const maxTagPlaceholderFunction = useFunction(maxTagPlaceholder);
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
              >(optionItems, {
                children: 'options',
                clone: true,
              })
            );
          }, [optionItems, options])}
          onChange={(v, ...args) => {
            onChange?.(v, ...args);
            onValueChange(v as string);
          }}
          allowClear={
            slots['allowClear.clearIcon']
              ? {
                  clearIcon: <ReactSlot slot={slots['allowClear.clearIcon']} />,
                }
              : props.allowClear
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
            maxTagPlaceholderFunction ||
            (slots.maxTagPlaceholder ? (
              <ReactSlot slot={slots.maxTagPlaceholder} />
            ) : (
              maxTagPlaceholder
            ))
          }
          getPopupContainer={getPopupContainerFunction}
          dropdownRender={dropdownRenderFunction}
          optionRender={optionRenderFunction}
          tagRender={tagRenderFunction}
          labelRender={labelRenderFunction}
          filterSort={filterSortFunction}
        />
      </>
    );
  }
);

export default Select;
