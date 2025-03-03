import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Welcome as XWelcome, type WelcomeProps } from '@ant-design/x';
import type { FileData } from '@gradio/client';
import { getFileUrl } from '@utils/upload';

export const Welcome = sveltify<
  Omit<WelcomeProps, 'icon'> & {
    urlRoot: string;
    urlProxyUrl: string;
    icon?: WelcomeProps['icon'] | FileData;
    children?: React.ReactNode;
  },
  ['description', 'icon', 'extra', 'title']
>(({ slots, children, urlProxyUrl, urlRoot, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <XWelcome
        {...props}
        extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
        icon={
          slots.icon ? (
            <ReactSlot slot={slots.icon} />
          ) : (
            getFileUrl(props.icon, urlRoot, urlProxyUrl)
          )
        }
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
