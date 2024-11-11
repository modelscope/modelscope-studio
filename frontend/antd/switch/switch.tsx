import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { type GetProps, Switch as ASwitch } from 'antd';

export const Switch = sveltify<
  GetProps<typeof ASwitch> & {
    children?: React.ReactNode;
    onValueChange?: (value: boolean) => void;
  },
  ['checkedChildren', 'unCheckedChildren']
>(({ slots, children, onValueChange, onChange, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <ASwitch
        {...props}
        onChange={(value, ...args) => {
          onValueChange?.(value);
          onChange?.(value, ...args);
        }}
        checkedChildren={
          slots.checkedChildren ? (
            <ReactSlot slot={slots.checkedChildren} />
          ) : (
            props.checkedChildren
          )
        }
        unCheckedChildren={
          slots.unCheckedChildren ? (
            <ReactSlot slot={slots.unCheckedChildren} />
          ) : (
            props.unCheckedChildren
          )
        }
      />
    </>
  );
});

export default Switch;
