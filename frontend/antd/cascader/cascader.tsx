import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Cascader as ACascader, type CascaderProps } from 'antd';

import { useItems, withItemsContextProvider } from './context';

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
    setSlotParams: SetSlotParams;
  },
  [
    'allowClear.clearIcon',
    'suffixIcon',
    'maxTagPlaceholder',
    'notFoundContent',
    'expandIcon',
    'prefix',
    'removeIcon',
    'displayRender',
    'tagRender',
    'dropdownRender',
    'popupRender',
    'showSearch.render',
  ]
>(
  withItemsContextProvider(
    ['default', 'options'],
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
      popupRender,
      optionRender,
      showSearch,
      options,
      setSlotParams,
      onLoadData,
      ...props
    }) => {
      const getPopupContainerFunction = useFunction(getPopupContainer);
      const displayRenderFunction = useFunction(displayRender);
      const tagRenderFunction = useFunction(tagRender);
      const optionRenderFunction = useFunction(optionRender);
      const dropdownRenderFunction = useFunction(dropdownRender);
      const popupRenderFunction = useFunction(popupRender);
      const maxTagPlaceholderFunction = useFunction(maxTagPlaceholder);
      const supportShowSearchConfig =
        typeof showSearch === 'object' || slots['showSearch.render'];
      const showSearchConfig = getConfig(showSearch);
      const showSearchFilterFunction = useFunction(showSearchConfig.filter);
      const showSearchRenderFunction = useFunction(showSearchConfig.render);
      const showSearchSortFunction = useFunction(showSearchConfig.sort);
      const [value, setValue] = useValueChange({
        onValueChange,
        value: props.value,
      });
      const { items: slotItems } = useItems<['default', 'options']>();
      const resolvedSlotItems =
        slotItems.options.length > 0 ? slotItems.options : slotItems.default;
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <ACascader
            {...props}
            ref={elRef}
            value={value}
            options={useMemo(() => {
              return (
                options ||
                renderItems<NonNullable<CascaderProps['options']>[number]>(
                  resolvedSlotItems,
                  {
                    clone: true,
                  }
                )
              );
            }, [options, resolvedSlotItems])}
            showSearch={
              supportShowSearchConfig
                ? {
                    ...showSearchConfig,
                    filter: showSearchFilterFunction || showSearchConfig.filter,
                    render: slots['showSearch.render']
                      ? renderParamsSlot({
                          slots,
                          setSlotParams,
                          key: 'showSearch.render',
                        })
                      : showSearchRenderFunction || showSearchConfig.render,
                    sort: showSearchSortFunction || showSearchConfig.sort,
                  }
                : showSearch
            }
            loadData={onLoadData}
            optionRender={optionRenderFunction}
            getPopupContainer={getPopupContainerFunction}
            prefix={
              slots.prefix ? <ReactSlot slot={slots.prefix} /> : props.prefix
            }
            dropdownRender={
              slots.dropdownRender
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'dropdownRender',
                  })
                : dropdownRenderFunction
            }
            popupRender={
              slots.popupRender
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'popupRender',
                  })
                : popupRenderFunction
            }
            displayRender={
              slots.displayRender
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'displayRender',
                  })
                : displayRenderFunction
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
            onChange={(v, ...args) => {
              onChange?.(v, ...args);
              setValue(v);
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
              slots.maxTagPlaceholder
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'maxTagPlaceholder',
                  })
                : maxTagPlaceholderFunction || maxTagPlaceholder
            }
            allowClear={
              slots['allowClear.clearIcon']
                ? {
                    clearIcon: (
                      <ReactSlot slot={slots['allowClear.clearIcon']} />
                    ),
                  }
                : props.allowClear
            }
          />
        </>
      );
    }
  )
);

export default Cascader;
