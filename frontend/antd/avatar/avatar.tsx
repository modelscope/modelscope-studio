import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Avatar as AAvatar, type GetProps } from 'antd';

export const Avatar = sveltify<GetProps<typeof AAvatar>, ['icon', 'src']>(
  ({ slots, children, ...props }) => {
    return (
      <>
        <div style={{ display: 'none' }}>
          {slots.icon || slots.src ? children : null}
        </div>
        <AAvatar
          {...props}
          icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
          src={
            slots.src ? <ReactSlot slot={slots.src} /> : props.src || undefined
          }
        >
          {slots.icon || slots.src ? null : children}
        </AAvatar>
      </>
    );
  }
);

export default Avatar;
