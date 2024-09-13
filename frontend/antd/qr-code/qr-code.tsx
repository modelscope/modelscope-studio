import { sveltify } from '@svelte-preprocess-react';
import { type GetProps, QRCode as AQRCode } from 'antd';

export const QRCode = sveltify<GetProps<typeof AQRCode>>(({ ...props }) => {
  return <AQRCode {...props} />;
});

export default QRCode;
