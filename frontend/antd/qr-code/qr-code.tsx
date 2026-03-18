import { sveltify } from '@svelte-preprocess-react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, QRCode as AQRCode } from 'antd';

export const QRCode = sveltify<GetProps<typeof AQRCode> & {}, ['statusRender']>(
  ({ slots, statusRender, ...props }) => {
    const statusRenderFunction = useFunction(statusRender);
    return (
      <AQRCode
        {...props}
        statusRender={
          slots.statusRender
            ? renderParamsSlot({ slots, key: 'statusRender' })
            : statusRenderFunction
        }
      />
    );
  }
);

export default QRCode;
