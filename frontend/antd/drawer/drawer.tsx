import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { Drawer as ADrawer, type GetProps } from 'antd';

export const Drawer = sveltify<
  GetProps<typeof ADrawer>,
  ['closeIcon', 'extra', 'footer', 'title']
>(({ slots, afterOpenChange, getContainer, drawerRender, ...props }) => {
  const afterOpenChangeFunction = useFunction(afterOpenChange);
  const getContainerFunction = useFunction(getContainer);
  const drawerRenderFunction = useFunction(drawerRender);
  return (
    <ADrawer
      {...props}
      afterOpenChange={afterOpenChangeFunction}
      closeIcon={
        slots.closeIcon ? <ReactSlot slot={slots.closeIcon} /> : props.closeIcon
      }
      extra={slots.extra ? <ReactSlot slot={slots.extra} /> : props.extra}
      footer={slots.footer ? <ReactSlot slot={slots.footer} /> : props.footer}
      title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
      drawerRender={drawerRenderFunction}
      getContainer={
        typeof getContainer === 'string' ? getContainerFunction : getContainer
      }
    />
  );
});

export default Drawer;
