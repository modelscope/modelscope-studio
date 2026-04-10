import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Bubble as XBubble, type BubbleProps } from '@ant-design/x';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}
export const Bubble = sveltify<
  BubbleProps & {},
  [
    'avatar',
    'editable.okText',
    'editable.cancelText',
    'content',
    'footer',
    'header',
    'extra',
    'loadingRender',
    'contentRender',
  ]
>(({ loadingRender, contentRender, slots, children, ...props }) => {
  const loadingRenderFunction = useFunction(loadingRender);
  const contentRenderFunction = useFunction(contentRender);
  const headerFunction = useFunction(props.header, true);
  const footerFunction = useFunction(props.footer, true);
  const avatarFunction = useFunction(props.avatar, true);
  const extraFunction = useFunction(props.extra, true);
  const typingFunction = useFunction(props.typing);
  const editableConfig = getConfig(props.editable);
  const supportEdit =
    props.editable || slots['editable.cancelText'] || slots['editable.okText'];

  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <XBubble
        {...props}
        editable={
          supportEdit
            ? {
                ...editableConfig,
                editing:
                  editableConfig.editing ||
                  (typeof props.editable === 'boolean'
                    ? props.editable
                    : undefined),
                cancelText: slots['editable.cancelText'] ? (
                  <ReactSlot slot={slots['editable.cancelText']} />
                ) : (
                  editableConfig.cancelText
                ),
                okText: slots['editable.okText'] ? (
                  <ReactSlot slot={slots['editable.okText']} />
                ) : (
                  editableConfig.okText
                ),
              }
            : props.editable
        }
        typing={typingFunction || props.typing}
        content={
          slots.content ? <ReactSlot slot={slots.content} /> : props.content
        }
        avatar={
          slots.avatar ? (
            <ReactSlot slot={slots.avatar} />
          ) : (
            avatarFunction || props.avatar
          )
        }
        extra={
          slots.extra ? (
            <ReactSlot slot={slots.extra} />
          ) : (
            extraFunction || props.extra
          )
        }
        footer={
          slots.footer ? (
            <ReactSlot slot={slots.footer} />
          ) : (
            footerFunction || props.footer
          )
        }
        header={
          slots.header ? (
            <ReactSlot slot={slots.header} />
          ) : (
            headerFunction || props.header
          )
        }
        loadingRender={
          slots.loadingRender
            ? renderParamsSlot({
                slots,
                key: 'loadingRender',
              })
            : loadingRenderFunction
        }
        contentRender={
          slots.contentRender
            ? renderParamsSlot({
                slots,
                key: 'contentRender',
              })
            : contentRenderFunction
        }
      />
    </>
  );
});

export default Bubble;
