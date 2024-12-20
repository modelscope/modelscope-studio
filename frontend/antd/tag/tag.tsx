import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { type GetProps, Tag as ATag } from 'antd';

export const Tag = sveltify<
  GetProps<typeof ATag> & {
    value?: string;
  },
  ['closeIcon', 'icon']
>(({ slots, value, children, ...props }) => {
  const targets = useTargets(children);
  return (
    <ATag
      {...props}
      icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
      closeIcon={
        slots.closeIcon ? <ReactSlot slot={slots.closeIcon} /> : props.closeIcon
      }
    >
      {targets.length > 0 ? (
        children
      ) : (
        <>
          {children}
          {value}
        </>
      )}
    </ATag>
  );
});

export default Tag;
