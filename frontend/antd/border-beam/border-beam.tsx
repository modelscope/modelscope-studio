import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { BorderBeam as ABorderBeam, type GetProps } from 'antd';

export const BorderBeam = sveltify<GetProps<typeof ABorderBeam>>(
  ({ children, ...props }) => {
    return <ABorderBeam {...props}>{children}</ABorderBeam>;
  }
);

export default BorderBeam;
