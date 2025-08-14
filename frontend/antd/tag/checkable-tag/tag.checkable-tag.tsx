import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { type GetProps, Tag as ATag } from 'antd';

export const CheckableTag = sveltify<
  GetProps<typeof ATag.CheckableTag> & {
    onValueChange: (checked: boolean) => void;
    label?: string;
  },
  ['icon']
>(({ onChange, onValueChange, children, label, slots, ...props }) => {
  const targets = useTargets(children);
  return (
    <>
      <div style={{ display: 'none' }}>
        {targets.length === 0 ? children : null}
      </div>
      <ATag.CheckableTag
        {...props}
        icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
        onChange={(v) => {
          onChange?.(v);
          onValueChange(v);
        }}
      >
        {targets.length > 0 ? children : label}
      </ATag.CheckableTag>
    </>
  );
});

export default CheckableTag;
