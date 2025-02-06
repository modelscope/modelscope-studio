import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Welcome as XWelcome, type WelcomeProps } from '@ant-design/x';

export const Welcome = sveltify<
  WelcomeProps & {
    children?: React.ReactNode;
  },
  ['description', 'icon', 'extra', 'title']
>(({ slots, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <XWelcome
        {...props}
        extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
        icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        description={
          slots.description ? (
            <ReactSlot slot={slots.description} />
          ) : (
            props.description
          )
        }
      />
    </>
  );
});

export default Welcome;
