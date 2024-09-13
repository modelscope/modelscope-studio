import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { type GetProps, Tag as ATag } from 'antd';

export const Tag = sveltify<GetProps<typeof ATag>, ['closeIcon', 'icon']>(
  ({ slots, ...props }) => {
    return (
      <ATag
        {...props}
        icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
        closeIcon={
          slots.closeIcon ? (
            <ReactSlot slot={slots.closeIcon} />
          ) : (
            props.closeIcon
          )
        }
      />
    );
  }
);

export default Tag;
