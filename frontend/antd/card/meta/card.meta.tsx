import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { Card as ACard, type GetProps } from 'antd';

export const CardMeta = sveltify<
  GetProps<typeof ACard.Meta> & {
    id?: string;
    children?: React.ReactNode;
  },
  ['avatar', 'description', 'title']
>(({ slots, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <ACard.Meta
        {...props}
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        description={
          slots.description ? (
            <ReactSlot slot={slots.description} />
          ) : (
            props.description
          )
        }
        avatar={slots.avatar ? <ReactSlot slot={slots.avatar} /> : props.avatar}
      />
    </>
  );
});

export default CardMeta;
