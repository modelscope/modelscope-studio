import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { Button as AButton, type GetProps } from 'antd';

export const Button = sveltify<GetProps<typeof AButton>, ['icon']>(
  ({ slots, value, children, ...props }) => {
    const targets = useTargets(children);
    return (
      <>
        <div style={{ display: 'none' }}>
          {targets.length > 0 ? null : children}
        </div>
        <AButton
          {...props}
          icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
        >
          {targets.length > 0 ? children : value}
        </AButton>
      </>
    );
  }
);

export default Button;
