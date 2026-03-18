import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Sender } from '@ant-design/x';
import type { SenderSwitchProps } from '@ant-design/x/es/sender/SenderSwitch';

export const SenderSwitch = sveltify<
  SenderSwitchProps,
  ['checkedChildren', 'unCheckedChildren', 'icon']
>(({ slots, ...props }) => {
  return (
    <Sender.Switch
      {...props}
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
      icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
    />
  );
});

export default SenderSwitch;
