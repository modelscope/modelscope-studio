import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Button as AButton, type GetProps } from 'antd';

export const Button = sveltify<GetProps<typeof AButton>, ['icon']>(
  ({ slots, ...props }) => {
    return (
      <AButton
        {...props}
        icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
      />
    );
  }
);

export default Button;
