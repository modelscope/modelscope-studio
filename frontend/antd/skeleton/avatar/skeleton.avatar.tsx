import { sveltify } from '@svelte-preprocess-react';
import { type GetProps, Skeleton as ASkeleton } from 'antd';

export const SkeletonAvatar = sveltify<GetProps<typeof ASkeleton.Avatar>>(
  ASkeleton.Avatar
);

export default SkeletonAvatar;
