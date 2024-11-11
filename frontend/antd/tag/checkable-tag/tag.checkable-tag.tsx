import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { type GetProps, Tag as ATag } from 'antd';

export const CheckableTag = sveltify<
  GetProps<typeof ATag.CheckableTag> & {
    onValueChange: (checked: boolean) => void;
  }
>(({ onChange, onValueChange, ...props }) => {
  return (
    <ATag.CheckableTag
      {...props}
      onChange={(v) => {
        onChange?.(v);
        onValueChange(v);
      }}
    />
  );
});

export default CheckableTag;
