import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { type GetProps, List as AList } from 'antd';

export const ListItemMeta = sveltify<
  GetProps<typeof AList.Item.Meta>,
  ['avatar', 'description', 'title']
>(({ slots, children, ...props }) => {
  return (
    <>
      <>{children}</>
      <AList.Item.Meta
        {...props}
        avatar={slots.avatar ? <ReactSlot slot={slots.avatar} /> : props.avatar}
        description={
          slots.description ? (
            <ReactSlot slot={slots.description} />
          ) : (
            props.description
          )
        }
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
      />
    </>
  );
});

export default ListItemMeta;
