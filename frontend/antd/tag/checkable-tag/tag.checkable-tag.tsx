import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { type GetProps, Tag as ATag } from 'antd';

export const CheckableTag = sveltify<
  GetProps<typeof ATag.CheckableTag> & {
    onValueChange: (checked: boolean) => void;
    label?: string;
  }
>(({ onChange, onValueChange, children, label, ...props }) => {
  const targets = useTargets(children);
  return (
    <ATag.CheckableTag
      {...props}
      onChange={(v) => {
        onChange?.(v);
        onValueChange(v);
      }}
    >
      {targets.length > 0 ? (
        children
      ) : (
        <>
          {children}
          {label}
        </>
      )}
    </ATag.CheckableTag>
  );
});

export default CheckableTag;
