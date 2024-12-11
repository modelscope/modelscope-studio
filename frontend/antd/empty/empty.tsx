import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { Empty as AEmpty, type GetProps } from 'antd';

export const Empty = sveltify<
  GetProps<typeof AEmpty>,
  ['description', 'image']
>(({ slots, imageStyle, ...props }) => {
  const getImage = () => {
    if (slots.image) {
      return <ReactSlot slot={slots.image} />;
    }
    switch (props.image) {
      case 'PRESENTED_IMAGE_DEFAULT':
        return AEmpty.PRESENTED_IMAGE_DEFAULT;
      case 'PRESENTED_IMAGE_SIMPLE':
        return AEmpty.PRESENTED_IMAGE_SIMPLE;
      default:
        return props.image;
    }
  };
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
      image={getImage()}
    />
  );
});

export default Empty;
