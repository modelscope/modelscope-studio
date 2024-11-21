import { sveltify } from '@svelte-preprocess-react';
import { Flex as AFlex, type GetProps } from 'antd';

export const Flex = sveltify<GetProps<typeof AFlex>>(
  ({ children, ...props }) => {
    return <AFlex {...props}>{children}</AFlex>;
  }
);

export default Flex;
