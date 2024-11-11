import { sveltify } from '@svelte-preprocess-react';
import { Card as ACard, type GetProps } from 'antd';

export const CardGrid = sveltify<GetProps<typeof ACard.Grid>>(ACard.Grid);

export default CardGrid;
