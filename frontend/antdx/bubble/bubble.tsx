import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { Bubble as XBubble, type BubbleProps } from '@ant-design/x';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import type { AvatarProps } from 'antd';

export const Bubble = sveltify<
  BubbleProps & {
    setSlotParams: SetSlotParams;
  },
  [
    'avatar',
    'avatar.icon',
    'avatar.src',
    'content',
    'footer',
    'header',
    'loadingRender',
    'messageRender',
  ]
>(
  ({
    loadingRender,
    messageRender,
    slots,
    setSlotParams,
    children,
    ...props
  }) => {
    const loadingRenderFunction = useFunction(loadingRender);
    const messageRenderFunction = useFunction(messageRender);
    const avatar = useMemo(() => {
      if (slots.avatar) {
        return <ReactSlot slot={slots.avatar} />;
      }
      if (slots['avatar.icon'] || slots['avatar.src']) {
        return {
          ...(props.avatar || {}),
          icon: slots['avatar.icon'] ? (
            <ReactSlot slot={slots['avatar.icon']} />
          ) : (
            (props.avatar as AvatarProps)?.icon
          ),
          src: slots['avatar.src'] ? (
            <ReactSlot slot={slots['avatar.src']} />
          ) : (
            (props.avatar as AvatarProps)?.src
          ),
        };
      }
      return props.avatar;
    }, [props.avatar, slots]);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <XBubble
          {...props}
          avatar={avatar}
          content={
            slots.content ? <ReactSlot slot={slots.content} /> : props.content
          }
          footer={
            slots.footer ? <ReactSlot slot={slots.footer} /> : props.footer
          }
          loadingRender={
            slots.loadingRender
              ? renderParamsSlot({
                  slots,
                  setSlotParams,
                  key: 'loadingRender',
                })
              : loadingRenderFunction
          }
          messageRender={
            slots.messageRender
              ? renderParamsSlot({
                  slots,
                  setSlotParams,
                  key: 'messageRender',
                })
              : messageRenderFunction
          }
        />
      </>
    );
  }
);

export default Bubble;
