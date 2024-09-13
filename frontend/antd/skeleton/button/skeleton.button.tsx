import { sveltify } from '@svelte-preprocess-react';
import { type GetProps, Skeleton as ASkeleton } from 'antd';

export const SkeletonButton = sveltify<GetProps<typeof ASkeleton.Button>>(
  ASkeleton.Button
);

export default SkeletonButton;
