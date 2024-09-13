import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { Affix as AAffix, type GetProps } from 'antd';

export const Affix = sveltify<GetProps<typeof AAffix>>(
  ({ target, ...props }) => {
    const targetFunction = useFunction(target);
    return <AAffix {...props} target={targetFunction} />;
  }
);

export default Affix;
