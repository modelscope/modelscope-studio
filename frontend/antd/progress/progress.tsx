import { sveltify } from '@svelte-preprocess-react';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Progress as AProgress } from 'antd';

export const Progress = sveltify<GetProps<typeof AProgress>>(
  ({ format, ...props }) => {
    const formatFunction = useFunction(format);
    return <AProgress {...props} format={formatFunction} />;
  }
);

export default Progress;
