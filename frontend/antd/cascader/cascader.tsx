import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { Cascader as ACascader, type CascaderProps } from 'antd';

import { type Item } from './context';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

export const Cascader = sveltify<
  CascaderProps<any> & {
    onValueChange: (value: string[] | number[]) => void;
    onLoadData?: (...args: any[]) => void;
    optionItems: Item[];
  },
  [
    'allowClear.clearIcon',
    'suffixIcon',
    'maxTagPlaceholder',
    'notFoundContent',
    'expandIcon',
    'removeIcon',
  ]
>(
  ({
    slots,
    children,
    onValueChange,
    onChange,
    displayRender,
    elRef,
    getPopupContainer,
    tagRender,
    maxTagPlaceholder,
    dropdownRender,
    optionRender,
    onLoadData,
    showSearch,
    optionItems,
    options,
    ...props
  }) => {
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const displayRenderFunction = useFunction(displayRender);
    const tagRenderFunction = useFunction(tagRender);
    const optionRenderFunction = useFunction(optionRender);
    const dropdownRenderFunction = useFunction(dropdownRender);
    const maxTagPlaceholderFunction = useFunction(maxTagPlaceholder);
    const supportShowSearchConfig = typeof showSearch === 'object';
    const showSearchConfig = getConfig(showSearch);
    const showSearchFilterFunction = useFunction(showSearchConfig.filter);
    const showSearchRenderFunction = useFunction(showSearchConfig.render);
    const showSearchSortFunction = useFunction(showSearchConfig.sort);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ACascader
          {...props}
          ref={elRef}
          options={useMemo(() => {
            return (
              options ||
              renderItems<NonNullable<CascaderProps['options']>[number]>(
                optionItems
              )
            );
          }, [options, optionItems])}
          showSearch={
            supportShowSearchConfig
              ? {
                  ...showSearchConfig,
                  filter: showSearchFilterFunction || showSearchConfig.filter,
                  render: showSearchRenderFunction || showSearchConfig.render,
                  sort: showSearchSortFunction || showSearchConfig.sort,
                }
              : showSearch
          }
          loadData={onLoadData}
          optionRender={optionRenderFunction}
          dropdownRender={dropdownRenderFunction}
          getPopupContainer={getPopupContainerFunction}
          displayRender={displayRenderFunction}
          tagRender={tagRenderFunction}
          onChange={(v, ...args) => {
            onChange?.(v, ...args);
            onValueChange(v);
          }}
          suffixIcon={
            slots.suffixIcon ? (
              <ReactSlot slot={slots.suffixIcon} />
            ) : (
              props.suffixIcon
            )
          }
          expandIcon={
            slots.expandIcon ? (
              <ReactSlot slot={slots.expandIcon} />
            ) : (
              props.expandIcon
            )
          }
          removeIcon={
            slots.removeIcon ? (
              <ReactSlot slot={slots.removeIcon} />
            ) : (
              props.removeIcon
            )
          }
          notFoundContent={
            slots.notFoundContent ? (
              <ReactSlot slot={slots.notFoundContent} />
            ) : (
              props.notFoundContent
            )
          }
          maxTagPlaceholder={
            maxTagPlaceholderFunction ||
            (slots.maxTagPlaceholder ? (
              <ReactSlot slot={slots.maxTagPlaceholder} />
            ) : (
              maxTagPlaceholder
            ))
          }
          allowClear={
            slots['allowClear.clearIcon']
              ? {
                  clearIcon: <ReactSlot slot={slots['allowClear.clearIcon']} />,
                }
              : props.allowClear
          }
        />
      </>
    );
  }
);

export default Cascader;
