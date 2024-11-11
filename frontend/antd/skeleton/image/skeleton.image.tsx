import { sveltify } from '@svelte-preprocess-react';
import { type GetProps, Skeleton as ASkeleton } from 'antd';

export const SkeletonImage = sveltify<GetProps<typeof ASkeleton.Image>>(
  ASkeleton.Image
);

export default SkeletonImage;
