import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Avatar as AAvatar, type GetProps } from 'antd';

export const Avatar = sveltify<GetProps<typeof AAvatar>, ['icon', 'src']>(
  ({ slots, children, ...props }) => {
    return (
      <>
        {slots.icon ? children : null}
        <AAvatar
          {...props}
          icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
          src={slots.src ? <ReactSlot slot={slots.src} /> : props.src}
        >
          {slots.icon ? null : children}
        </AAvatar>
      </>
    );
  }
);

export default Avatar;
