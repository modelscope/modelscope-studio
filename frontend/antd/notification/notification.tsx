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
      notificationKey?: string | number;
      visible?: boolean;
      onVisible?: (visible: boolean) => void;
    },
  ['btn', 'actions', 'closeIcon', 'description', 'icon', 'message']
>(
  ({
    slots,
    bottom,
    rtl,
    stack,
    top,
    children,
    visible,
    notificationKey,
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
          key: notificationKey,
          btn: slots.btn ? <ReactSlot slot={slots.btn} /> : props.btn,
          actions: slots.actions ? (
            <ReactSlot slot={slots.actions} />
          ) : (
            props.actions
          ),
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
        notificationApi.destroy(notificationKey);
      }

      return () => {
        notificationApi.destroy(notificationKey);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      visible,
      notificationKey,
      props.btn,
      props.actions,
      props.closeIcon,
      props.className,
      props.description,
      props.duration,
      props.showProgress,
      props.pauseOnHover,
      props.icon,
      props.message,
      props.placement,
      props.style,
      props.role,
      props.props,
    ]);
    return (
      <>
        {children}
        {contextHolder}
      </>
    );
  }
);

export default Notification;
