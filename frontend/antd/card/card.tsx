import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { Card as ACard, type GetProps } from 'antd';

export const Card = sveltify<
  GetProps<typeof ACard> & {
    containsGrid?: boolean;
  },
  ['actions', 'cover', 'extra', 'tabBarExtraContent', 'title']
>(({ children, containsGrid, slots, ...props }) => {
  const targets = useTargets(children, 'actions');
  return (
    <ACard
      {...props}
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
});

export default Card;
