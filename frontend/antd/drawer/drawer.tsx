import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Drawer as ADrawer, type GetProps } from 'antd';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}
export const Drawer = sveltify<
  GetProps<typeof ADrawer> & {
    setSlotParams: SetSlotParams;
  },
  [
    'closeIcon',
    'closeable.closeIcon',
    'extra',
    'footer',
    'title',
    'drawerRender',
  ]
>(
  ({
    slots,
    afterOpenChange,
    getContainer,
    drawerRender,
    setSlotParams,
    ...props
  }) => {
    const afterOpenChangeFunction = useFunction(afterOpenChange);
    const getContainerFunction = useFunction(getContainer);
    const drawerRenderFunction = useFunction(drawerRender);
    const closeableConfig = getConfig(props.closable);
    return (
      <ADrawer
        {...props}
        afterOpenChange={afterOpenChangeFunction}
        closable={
          slots['closeable.closeIcon']
            ? {
                ...closeableConfig,
                closeIcon: <ReactSlot slot={slots['closeable.closeIcon']} />,
              }
            : props.closable
        }
        closeIcon={
          slots.closeIcon ? (
            <ReactSlot slot={slots.closeIcon} />
          ) : (
            props.closeIcon
          )
        }
        extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
        footer={slots.footer ? <ReactSlot slot={slots.footer} /> : props.footer}
        title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        drawerRender={
          slots.drawerRender
            ? renderParamsSlot({ slots, setSlotParams, key: 'drawerRender' })
            : drawerRenderFunction
        }
        getContainer={
          typeof getContainer === 'string' ? getContainerFunction : getContainer
        }
      />
    );
  }
);

export default Drawer;
