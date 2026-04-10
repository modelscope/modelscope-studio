import { sveltify } from '@svelte-preprocess-react';
import { useEffect } from 'react';
import { notification, type XNotificationOpenArgs } from '@ant-design/x';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';

export const Notification = sveltify<
  XNotificationOpenArgs & {
    visible: boolean;
    onVisible: (visible: boolean) => void;
    onPermission?: (permission: NotificationPermission) => void;
  }
>(({ onClose, visible, onVisible, tag, duration, onPermission, ...props }) => {
  const [{ permission }, { open, close, requestPermission }] =
    notification.useNotification();
  const onPermissionMemoized = useMemoizedFn(onPermission);

  useEffect(() => {
    onPermissionMemoized(permission);
  }, [permission, onPermissionMemoized]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (visible) {
      if (typeof duration === 'number') {
        timer = setTimeout(() => {
          onVisible?.(false);
        }, duration);
      }
      const run = async () => {
        let result = permission;
        if (result !== 'granted') {
          result = await requestPermission();
        }
        if (result === 'granted') {
          open({
            ...props,
            tag,
            onClose(...args) {
              timer && clearTimeout(timer);
              onVisible?.(false);
              onClose?.(...args);
            },
          });
        }
      };
      run();
    } else {
      close(tag ? [tag] : undefined);
    }

    return () => {
      close(tag ? [tag] : undefined);
      timer && clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, duration, tag]);
  return null;
});

export default Notification;
