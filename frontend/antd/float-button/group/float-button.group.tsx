import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useSlotsChildren } from '@utils/hooks/useSlotsChildren';
import { FloatButton as AFloatButton, type GetProps, theme } from 'antd';
import cls from 'classnames';

import './float-button.group.less';

export const FloatButtonGroup = sveltify<
  GetProps<typeof AFloatButton.Group> & {
    id?: string;
  },
  ['icon', 'closeIcon', 'description', 'tooltip', 'badge.count']
>(({ children, slots, style, shape = 'circle', className, ...props }) => {
  const { token } = theme.useToken();

  const [slotsChildren, restChildren] = useSlotsChildren(children);
  return (
    <>
      <div style={{ display: 'none' }}>{slotsChildren}</div>
      <AFloatButton.Group
        {...props}
        shape={shape}
        className={cls(className, `ms-gr-antd-float-button-group-${shape}`)}
        style={
          {
            ...style,
            '--ms-gr-antd-border-radius-lg': token.borderRadiusLG + 'px',
          } as React.CSSProperties
        }
        closeIcon={
          slots.closeIcon ? (
            <ReactSlot clone slot={slots.closeIcon} />
          ) : (
            props.closeIcon
          )
        }
        icon={slots.icon ? <ReactSlot clone slot={slots.icon} /> : props.icon}
        description={
          slots.description ? (
            <ReactSlot clone slot={slots.description} />
          ) : (
            props.description
          )
        }
        tooltip={
          slots.tooltip ? (
            <ReactSlot clone slot={slots.tooltip} />
          ) : (
            props.tooltip
          )
        }
        badge={{
          ...props.badge,
          count: slots['badge.count'] ? (
            <ReactSlot slot={slots['badge.count']} />
          ) : (
            props.badge?.count
          ),
        }}
      >
        {restChildren}
      </AFloatButton.Group>
    </>
  );
});

export default FloatButtonGroup;
