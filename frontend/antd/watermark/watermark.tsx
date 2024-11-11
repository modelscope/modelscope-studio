import { sveltify } from '@svelte-preprocess-react';
import { type GetProps, Watermark as AWatermark } from 'antd';

export const Watermark = sveltify<GetProps<typeof AWatermark>>(AWatermark);
export default Watermark;
