import { sveltify } from '@svelte-preprocess-react';
import { type GetProps, Skeleton as ASkeleton } from 'antd';

export const SkeletonInput = sveltify<GetProps<typeof ASkeleton.Input>>(
  ASkeleton.Input
);

export default SkeletonInput;
