import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Think as XThink, type ThinkProps } from '@ant-design/x';

export const Think = sveltify<ThinkProps, ['loading', 'icon', 'title']>(
  ({ slots, ...props }) => {
    return (
      <>
        <XThink
          {...props}
          loading={
            slots.loading ? <ReactSlot slot={slots.loading} /> : props.loading
          }
          icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
          title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        />
      </>
    );
  }
);

export default Think;
