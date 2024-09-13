import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useTargets } from '@utils/hooks/useTargets';
import { type GetProps, List as AList } from 'antd';

export const ListItem = sveltify<
  GetProps<typeof AList.Item>,
  ['extra', 'actions']
>(({ slots, children, ...props }) => {
  const actionsSlots = useTargets(children, 'actions');
  return (
    <AList.Item
      {...props}
      extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
      actions={
        actionsSlots.length > 0
          ? actionsSlots.map((slot, index) => {
              return <ReactSlot key={index} slot={slot} />;
            })
          : props.actions
      }
    >
      {children}
    </AList.Item>
  );
});

export default ListItem;
