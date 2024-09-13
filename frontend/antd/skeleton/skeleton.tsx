import { sveltify } from '@svelte-preprocess-react';
import { type GetProps, Skeleton as ASkeleton } from 'antd';

export const Skeleton = sveltify<GetProps<typeof ASkeleton>>(ASkeleton);

export default Skeleton;
