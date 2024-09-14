import { sveltify } from '@svelte-preprocess-react';
import { AutoCompleteContext } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { forwardRef, useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { AutoComplete as AAutoComplete, type GetProps } from 'antd';

import { type Item } from './context';

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

export const AutoComplete = sveltify<
  GetProps<typeof AAutoComplete> & {
    optionItems: Item[];
    onValueChange: (value: string) => void;
  },
  ['allowClear.clearIcon', 'children', 'notFoundContent']
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
    elRef,
    ...props
  }) => {
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const filterOptionFunction = useFunction(filterOption);
    const dropdownRenderFunction = useFunction(dropdownRender);
    return (
      <>
        {slots.children ? null : (
          <div style={{ display: 'none' }}>{children}</div>
        )}

        <AAutoComplete
          {...props}
          ref={elRef}
          allowClear={
            slots['allowClear.clearIcon']
              ? {
                  clearIcon: <ReactSlot slot={slots['allowClear.clearIcon']} />,
                }
              : props.allowClear
          }
          options={useMemo(() => {
            return (
              options ||
              renderItems<
                NonNullable<GetProps<typeof AAutoComplete>['options']>[number]
              >(optionItems, {
                children: 'options',
              })
            );
          }, [optionItems, options])}
          onChange={(v, ...args) => {
            onChange?.(v, ...args);
            onValueChange(v as string);
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
          dropdownRender={dropdownRenderFunction}
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
);

export default AutoComplete;