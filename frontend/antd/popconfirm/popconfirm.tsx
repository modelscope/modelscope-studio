import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Popconfirm as APopconfirm } from 'antd';

export const Popconfirm = sveltify<
  GetProps<typeof APopconfirm>,
  [
    'title',
    'cancelButtonProps.icon',
    'cancelText',
    'description',
    'okButtonProps.icon',
    'okText',
  ]
>(({ slots, afterOpenChange, getPopupContainer, children, ...props }) => {
  const afterOpenChangeFunction = useFunction(afterOpenChange);
  const getPopupContainerFunction = useFunction(getPopupContainer);

  return (
    <APopconfirm
      {...props}
      afterOpenChange={afterOpenChangeFunction}
      getPopupContainer={getPopupContainerFunction}
      okText={slots.okText ? <ReactSlot slot={slots.okText} /> : props.okText}
      okButtonProps={{
        ...(props.okButtonProps || {}),
        icon: slots['okButtonProps.icon'] ? (
          <ReactSlot slot={slots['okButtonProps.icon']} />
        ) : (
          props.okButtonProps?.icon
        ),
      }}
      cancelText={
        slots.cancelText ? (
          <ReactSlot slot={slots.cancelText} />
        ) : (
          props.cancelText
        )
      }
      cancelButtonProps={{
        ...(props.cancelButtonProps || {}),
        icon: slots['cancelButtonProps.icon'] ? (
          <ReactSlot slot={slots['cancelButtonProps.icon']} />
        ) : (
          props.cancelButtonProps?.icon
        ),
      }}
      title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
      description={
        slots.description ? (
          <ReactSlot slot={slots.description} />
        ) : (
          props.description
        )
      }
    >
      {children}
    </APopconfirm>
  );
});

export default Popconfirm;
