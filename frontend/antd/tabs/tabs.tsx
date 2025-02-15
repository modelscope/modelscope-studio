import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Tabs as ATabs } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const Tabs = sveltify<
  GetProps<typeof ATabs> & {
    setSlotParams: SetSlotParams;
  },
  [
    'addIcon',
    'removeIcon',
    'renderTabBar',
    'tabBarExtraContent',
    'tabBarExtraContent.left',
    'tabBarExtraContent.right',
    'more.icon',
  ]
>(
  withItemsContextProvider(
    ['items', 'default'],
    ({
      slots,
      indicator,
      items,
      onChange,
      more,
      children,
      renderTabBar,
      setSlotParams,
      ...props
    }) => {
      const indicatorSizeFunction = useFunction(indicator?.size);
      const getMorePopupContainerFunction = useFunction(
        more?.getPopupContainer
      );
      const renderTabBarFunction = useFunction(renderTabBar);
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems =
        slotItems.items.length > 0 ? slotItems.items : slotItems.default;
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
            renderTabBar={
              slots.renderTabBar
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'renderTabBar',
                  })
                : renderTabBarFunction
            }
            items={useMemo(() => {
              return (
                items ||
                renderItems<
                  NonNullable<GetProps<typeof ATabs>['items']>[number]
                >(resolvedSlotItems)
              );
            }, [items, resolvedSlotItems])}
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
            }}
          />
        </>
      );
    }
  )
);

export default Tabs;
