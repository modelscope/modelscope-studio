import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Actions } from '@ant-design/x';
import type { ActionsCopyProps } from '@ant-design/x/es/actions/ActionsCopy';

export const ActionsCopy = sveltify<ActionsCopyProps, ['icon']>(
  ({ slots, children, ...props }) => {
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <Actions.Copy
          {...props}
          icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
        />
      </>
    );
  }
);

export default ActionsCopy;
