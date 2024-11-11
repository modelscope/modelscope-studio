import { sveltify } from '@svelte-preprocess-react';
import { type GetProps, Skeleton as ASkeleton } from 'antd';

export const SkeletonNode = sveltify<GetProps<typeof ASkeleton.Node>>(
  ASkeleton.Node
);

export default SkeletonNode;
