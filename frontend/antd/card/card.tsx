import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useTargets } from '@utils/hooks/useTargets';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Card as ACard, type GetProps } from 'antd';

import {
  useItems as useTabsItems,
  withItemsContextProvider as withTabsItemsContextProvider,
} from '../tabs/context';

export const Card = sveltify<
  GetProps<typeof ACard> & {
    containsGrid?: boolean;
    setSlotParams: SetSlotParams;
  },
  [
    'actions',
    'cover',
    'extra',
    'tabBarExtraContent',
    'tabBarExtraContent.left',
    'tabBarExtraContent.right',
    'title',
    'tabProps.addIcon',
    'tabProps.removeIcon',
    'tabProps.renderTabBar',
    'tabProps.tabBarExtraContent',
    'tabProps.tabBarExtraContent.left',
    'tabProps.tabBarExtraContent.right',
    'tabProps.more.icon',
  ]
>(
  withTabsItemsContextProvider(
    ['tabList'],
    ({
      children,
      containsGrid,
      slots,
      tabList,
      tabProps,
      setSlotParams,
      ...props
    }) => {
      const targets = useTargets(children, 'actions');
      const {
        items: { tabList: tabListItems },
      } = useTabsItems<['tabList']>();
      const { indicator, more, renderTabBar } = tabProps || {};
      const indicatorSizeFunction = useFunction(indicator?.size);
      const getMorePopupContainerFunction = useFunction(
        more?.getPopupContainer
      );
      const renderTabBarFunction = useFunction(renderTabBar);
      return (
        <ACard
          {...props}
          tabProps={{
            ...(tabProps || {}),
            indicator: indicatorSizeFunction
              ? {
                  ...indicator,
                  size: indicatorSizeFunction,
                }
              : indicator,
            renderTabBar: slots['tabProps.renderTabBar']
              ? renderParamsSlot({
                  slots,
                  setSlotParams,
                  key: 'tabProps.renderTabBar',
                })
              : renderTabBarFunction,
            more: omitUndefinedProps({
              ...(more || {}),
              getPopupContainer:
                getMorePopupContainerFunction || more?.getPopupContainer,
              icon: slots['tabProps.more.icon'] ? (
                <ReactSlot slot={slots['tabProps.more.icon']} />
              ) : (
                more?.icon
              ),
            }),
            tabBarExtraContent: slots['tabProps.tabBarExtraContent'] ? (
              <ReactSlot slot={slots['tabProps.tabBarExtraContent']} />
            ) : slots['tabProps.tabBarExtraContent.left'] ||
              slots['tabProps.tabBarExtraContent.right'] ? (
              {
                left: slots['tabProps.tabBarExtraContent.left'] ? (
                  <ReactSlot slot={slots['tabProps.tabBarExtraContent.left']} />
                ) : undefined,
                right: slots['tabProps.tabBarExtraContent.right'] ? (
                  <ReactSlot
                    slot={slots['tabProps.tabBarExtraContent.right']}
                  />
                ) : undefined,
              }
            ) : (
              tabProps?.tabBarExtraContent
            ),
            addIcon: slots['tabProps.addIcon'] ? (
              <ReactSlot slot={slots['tabProps.addIcon']} />
            ) : (
              tabProps?.addIcon
            ),
            removeIcon: slots['tabProps.removeIcon'] ? (
              <ReactSlot slot={slots['tabProps.removeIcon']} />
            ) : (
              tabProps?.removeIcon
            ),
          }}
          tabList={useMemo(() => {
            return (
              tabList ||
              renderItems<
                NonNullable<GetProps<typeof ACard>['tabList']>[number]
              >(tabListItems)
            );
          }, [tabList, tabListItems])}
          title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
          extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
          cover={slots.cover ? <ReactSlot slot={slots.cover} /> : props.cover}
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
          actions={
            targets.length > 0
              ? targets.map((target, index) => {
                  return <ReactSlot key={index} slot={target} />;
                })
              : props.actions
          }
        >
          {containsGrid ? <ACard.Grid style={{ display: 'none' }} /> : null}
          {children}
        </ACard>
      );
    }
  )
);

export default Card;
