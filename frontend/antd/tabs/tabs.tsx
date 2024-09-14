import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { type GetProps, Tabs as ATabs } from 'antd';

import { type Item } from './context';

export const Tabs = sveltify<
  GetProps<typeof ATabs> & {
    slotItems: Item[];
    onValueChange: (activeKey: string) => void;
  },
  [
    'addIcon',
    'removeIcon',
    'tabBarExtraContent',
    'tabBarExtraContent.left',
    'tabBarExtraContent.right',
    'more.icon',
  ]
>(
  ({
    slots,
    indicator,
    items,
    onChange,
    onValueChange,
    slotItems,
    more,
    children,
    ...props
  }) => {
    const indicatorSizeFunction = useFunction(indicator?.size);
    const getMorePopupContainerFunction = useFunction(more?.getPopupContainer);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ATabs
          {...props}
          indicator={
            indicatorSizeFunction
              ? {
                  ...indicator,
                  size: indicatorSizeFunction,
                }
              : indicator
          }
          items={useMemo(() => {
            return (
              items ||
              renderItems<NonNullable<GetProps<typeof ATabs>['items']>[number]>(
                slotItems
              )
            );
          }, [items, slotItems])}
          more={omitUndefinedProps({
            ...(more || {}),
            getPopupContainer:
              getMorePopupContainerFunction || more?.getPopupContainer,
            icon: slots['more.icon'] ? (
              <ReactSlot slot={slots['more.icon']} />
            ) : (
              more?.icon
            ),
          })}
          tabBarExtraContent={
            slots['tabBarExtraContent'] ? (
              <ReactSlot slot={slots['tabBarExtraContent']} />
            ) : slots['tabBarExtraContent.left'] ||
              slots['tabBarExtraContent.right'] ? (
              {
                left: slots['tabBarExtraContent.left'] ? (
                  <ReactSlot slot={slots['tabBarExtraContent.left']} />
                ) : undefined,
                right: slots['tabBarExtraContent.right'] ? (
                  <ReactSlot slot={slots['tabBarExtraContent.right']} />
                ) : undefined,
              }
            ) : (
              props.tabBarExtraContent
            )
          }
          addIcon={
            slots.addIcon ? <ReactSlot slot={slots.addIcon} /> : props.addIcon
          }
          removeIcon={
            slots.removeIcon ? (
              <ReactSlot slot={slots.removeIcon} />
            ) : (
              props.removeIcon
            )
          }
          onChange={(activeKey) => {
            onChange?.(activeKey);
            onValueChange(activeKey);
          }}
        />
      </>
    );
  }
);

export default Tabs;