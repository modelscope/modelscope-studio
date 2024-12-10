import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useEffect } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { message } from 'antd';
import { type ArgsProps } from 'antd/es/message';
import type { ConfigOptions } from 'antd/es/message/interface';

export const Message = sveltify<
  ArgsProps &
    ConfigOptions & {
      children?: React.ReactNode;
      visible?: boolean;
      messageKey?: string | number;
      onVisible?: (visible: boolean) => void;
    },
  ['content', 'icon']
>(
  ({
    slots,
    children,
    visible,
    onVisible,
    onClose,
    getContainer,
    messageKey,
    ...props
  }) => {
    const getContainerFunction = useFunction(getContainer);
    const [messageApi, contextHolder] = message.useMessage({
      ...props,
      getContainer: getContainerFunction,
    });

    useEffect(() => {
      if (visible) {
        messageApi.open({
          ...props,
          key: messageKey,
          icon: slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon,
          content: slots.content ? (
            <ReactSlot slot={slots.content} />
          ) : (
            props.content
          ),
          onClose(...args) {
            onVisible?.(false);
            onClose?.(...args);
          },
        });
      } else {
        messageApi.destroy(messageKey);
      }

      return () => {
        messageApi.destroy(messageKey);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      visible,
      messageKey,
      props.content,
      props.className,
      props.duration,
      props.icon,
      props.style,
      props.type,
    ]);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        {contextHolder}
      </>
    );
  }
);

export default Message;
