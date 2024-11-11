import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useEffect } from 'react';
import { notification } from 'antd';
import { type ArgsProps } from 'antd/es/notification';
import type { NotificationConfig } from 'antd/es/notification/interface';

export const Notification = sveltify<
  ArgsProps &
    NotificationConfig & {
      children?: React.ReactNode;
      visible?: boolean;
      onVisible?: (visible: boolean) => void;
    },
  ['btn', 'closeIcon', 'description', 'icon', 'message']
>(
  ({
    slots,
    bottom,
    rtl,
    stack,
    top,
    children,
    visible,
    onClose,
    onVisible,
    ...props
  }) => {
    const [notificationApi, contextHolder] = notification.useNotification({
      bottom,
      rtl,
      stack,
      top,
    });

    useEffect(() => {
      if (visible) {
        notificationApi.open({
          ...props,
          btn: slots.btn ? <ReactSlot slot={slots.btn} /> : props.btn,
          closeIcon: slots['closeIcon'] ? (
            <ReactSlot slot={slots['closeIcon']} />
          ) : (
            props.closeIcon
          ),
          description: slots.description ? (
            <ReactSlot slot={slots.description} />
          ) : (
            props.description
          ),
          message: slots.message ? (
            <ReactSlot slot={slots.message} />
          ) : (
            props.message
          ),
          icon: slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon,
          onClose(...args) {
            onVisible?.(false);
            onClose?.(...args);
          },
        });
      } else {
        notificationApi.destroy(props.key);
      }

      return () => {
        notificationApi.destroy(props.key);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);
    return (
      <>
        {children}
        {contextHolder}
      </>
    );
  }
);

export default Notification;
