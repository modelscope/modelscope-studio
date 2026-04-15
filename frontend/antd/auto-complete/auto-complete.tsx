import { sveltify } from '@svelte-preprocess-react';
import { AutoCompleteContext } from '@svelte-preprocess-react/react-contexts';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { forwardRef, useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { AutoComplete as AAutoComplete, type GetProps } from 'antd';

import { useItems, withItemsContextProvider } from './context';

// eslint-disable-next-line react/display-name
const AutoCompleteChildrenWrapper = forwardRef<
  HTMLElement,
  { children?: React.ReactNode }
>(({ children, ...props }, ref) => {
  return (
    <AutoCompleteContext.Provider
      value={useMemo(() => {
        return {
          ...props,
          elRef: ref,
        };
      }, [props, ref])}
    >
      {children}
    </AutoCompleteContext.Provider>
  );
});

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

export const AutoComplete = sveltify<
  GetProps<typeof AAutoComplete> & {
    onValueChange: (value: string) => void;
  },
  [
    'allowClear.clearIcon',
    'children',
    'dropdownRender',
    'popupRender',
    'notFoundContent',
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
      showSearch,
      elRef,
      ...props
    }) => {
      const showSearchConfig = getConfig(showSearch);
      const showSearchConfigFilterOption = useFunction(
        showSearchConfig.filterOption
      );

      const getPopupContainerFunction = useFunction(getPopupContainer);
      const filterOptionFunction = useFunction(filterOption);
      const dropdownRenderFunction = useFunction(dropdownRender);
      const popupRenderFunction = useFunction(popupRender);
      const [value, setValue] = useValueChange({
        onValueChange,
        value: props.value,
      });
      const { items: slotItems } = useItems<['options', 'default']>();
      const resolvedSlotItems =
        slotItems.options.length > 0 ? slotItems.options : slotItems.default;
      return (
        <>
          {slots.children ? null : (
            <div style={{ display: 'none' }}>{children}</div>
          )}

          <AAutoComplete
            {...props}
            showSearch={
              typeof showSearch === 'boolean'
                ? showSearch
                : typeof showSearch === 'object'
                  ? {
                      ...showSearchConfig,
                      filterOption: showSearchConfigFilterOption,
                    }
                  : undefined
            }
            value={value}
            ref={elRef}
            allowClear={
              slots['allowClear.clearIcon']
                ? {
                    clearIcon: (
                      <ReactSlot slot={slots['allowClear.clearIcon']} />
                    ),
                  }
                : props.allowClear
            }
            options={useMemo(() => {
              return (
                options ||
                renderItems<
                  NonNullable<GetProps<typeof AAutoComplete>['options']>[number]
                >(resolvedSlotItems, {
                  children: 'options',

                  // clone: true,
                })
              );
            }, [resolvedSlotItems, options])}
            onChange={(v, ...args) => {
              onChange?.(v, ...args);
              setValue(v as string);
            }}
            notFoundContent={
              slots.notFoundContent ? (
                <ReactSlot slot={slots.notFoundContent} />
              ) : (
                props.notFoundContent
              )
            }
            filterOption={filterOptionFunction || filterOption}
            getPopupContainer={getPopupContainerFunction}
            popupRender={
              slots.popupRender
                ? renderParamsSlot(
                    {
                      slots,
                      key: 'popupRender',
                    },
                    { clone: true }
                  )
                : popupRenderFunction
            }
            dropdownRender={
              slots.dropdownRender
                ? renderParamsSlot(
                    {
                      slots,
                      key: 'dropdownRender',
                    },
                    { clone: true }
                  )
                : dropdownRenderFunction
            }
          >
            {slots.children ? (
              <AutoCompleteChildrenWrapper>
                <div style={{ display: 'none' }}>{children}</div>
                <ReactSlot slot={slots.children} />
              </AutoCompleteChildrenWrapper>
            ) : null}
          </AAutoComplete>
        </>
      );
    }
  )
);

export default AutoComplete;
