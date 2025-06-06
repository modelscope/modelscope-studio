import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { Avatar as AAvatar, type GetProps } from 'antd';

import './avatar.group.less';

export const AvatarGroup = sveltify<
  GetProps<typeof AAvatar.Group>,
  ['max.popover.title', 'max.popover.content']
>(({ slots, children, ...props }) => {
  const targets = useTargets(children);
  return (
    <>
      <AAvatar.Group
        {...props}
        max={{
          ...props.max,
          count:
            typeof props.max?.count === 'number'
              ? // children render
                props.max.count + 1
              : props.max?.count,
          popover: !(slots['max.popover.title'] || slots['max.popover.content'])
            ? props.max?.popover
            : {
                ...(props.max?.popover || {}),
                title: slots['max.popover.title'] ? (
                  <ReactSlot slot={slots['max.popover.title']} />
                ) : (
                  props.max?.popover?.title
                ),
                content: slots['max.popover.content'] ? (
                  <ReactSlot slot={slots['max.popover.content']} />
                ) : (
                  props.max?.popover?.content
                ),
              },
        }}
      >
        <div style={{ display: 'none' }}>{children}</div>
        {targets.map((target, index) => {
          return <ReactSlot slot={target} key={index} />;
        })}
      </AAvatar.Group>
    </>
  );
});

export default AvatarGroup;
