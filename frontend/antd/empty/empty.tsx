import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { Empty as AEmpty, type GetProps } from 'antd';

export const Empty = sveltify<
  GetProps<typeof AEmpty>,
  ['description', 'image']
>(({ slots, imageStyle, ...props }) => {
  return (
    <AEmpty
      {...props}
      description={
        slots.description ? (
          <ReactSlot slot={slots.description} />
        ) : (
          props.description
        )
      }
      imageStyle={{
        display: 'inline-block',
        ...imageStyle,
      }}
      image={slots.image ? <ReactSlot slot={slots.image} /> : props.image}
    />
  );
});

export default Empty;
