import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { renderItems } from '@utils/renderItems';
import { Card as ACard, type GetProps } from 'antd';

import { type Item } from '../tabs/context';

export const Card = sveltify<
  GetProps<typeof ACard> & {
    containsGrid?: boolean;
    tabListItems: Item[];
    setSlotParams: SetSlotParams;
  },
  [
    'actions',
    'cover',
    'extra',
    'tabBarExtraContent',
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
  ({
    children,
    containsGrid,
    slots,
    tabListItems,
    tabList,
    tabProps,
    ...props
  }) => {
    const targets = useTargets(children, 'actions');

    return (
      <ACard
        {...props}
        tabProps={tabProps}
        tabList={useMemo(() => {
          return (
            tabList ||
            renderItems<NonNullable<GetProps<typeof ACard>['tabList']>[number]>(
              tabListItems
            )
          );
        }, [tabList, tabListItems])}
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
        cover={slots.cover ? <ReactSlot slot={slots.cover} /> : props.cover}
        tabBarExtraContent={
          slots.tabBarExtraContent ? (
            <ReactSlot slot={slots.tabBarExtraContent} />
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
);

export default Card;
