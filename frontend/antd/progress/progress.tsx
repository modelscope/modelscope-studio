import { sveltify } from '@svelte-preprocess-react';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Progress as AProgress } from 'antd';

export const Progress = sveltify<
  GetProps<typeof AProgress> & {
    rounding: (step: number) => number;
  }
>(({ format, rounding, ...props }) => {
  const formatFunction = useFunction(format);
  const roundingFunction = useFunction(rounding);
  return (
    <AProgress
      {...{
        ...props,
        rounding: roundingFunction,
        format: formatFunction,
      }}
    />
  );
});

export default Progress;
