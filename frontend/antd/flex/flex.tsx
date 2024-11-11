import { sveltify } from '@svelte-preprocess-react';
import { Flex as AFlex, type GetProps } from 'antd';

export const Flex = sveltify<GetProps<typeof AFlex>>((props) => {
  return <AFlex {...props} />;
});

export default Flex;
