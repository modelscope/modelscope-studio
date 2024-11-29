import { sveltify } from '@svelte-preprocess-react';
import { AutoCompleteContext } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { forwardRef, useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
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
    setSlotParams: SetSlotParams;
  },
  ['allowClear.clearIcon', 'children', 'dropdownRender', 'notFoundContent']
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
    setSlotParams,
    ...props
  }) => {
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const filterOptionFunction = useFunction(filterOption);
    const dropdownRenderFunction = useFunction(dropdownRender);
    const [value, setValue] = useValueChange({
      onValueChange,
      value: props.value,
    });
    return (
      <>
        {slots.children ? null : (
          <div style={{ display: 'none' }}>{children}</div>
        )}

        <AAutoComplete
          {...props}
          value={value}
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
                clone: true,
              })
            );
          }, [optionItems, options])}
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
          dropdownRender={
            slots.dropdownRender
              ? renderParamsSlot(
                  {
                    slots,
                    setSlotParams,
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
);

export default AutoComplete;
