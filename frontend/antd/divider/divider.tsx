import { sveltify } from '@svelte-preprocess-react';
import { Divider as ADivider, type GetProps } from 'antd';

export const Divider = sveltify<GetProps<typeof ADivider>>(({ ...props }) => {
  return <ADivider {...props} />;
});

export default Divider;
