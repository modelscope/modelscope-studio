import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, QRCode as AQRCode } from 'antd';

export const QRCode = sveltify<
  GetProps<typeof AQRCode> & {
    setSlotParams: SetSlotParams;
  },
  ['statusRender']
>(({ setSlotParams, slots, statusRender, ...props }) => {
  const statusRenderFunction = useFunction(statusRender);
  return (
    <AQRCode
      {...props}
      statusRender={
        slots.statusRender
          ? renderParamsSlot({ slots, setSlotParams, key: 'statusRender' })
          : statusRenderFunction
      }
    />
  );
});

export default QRCode;
