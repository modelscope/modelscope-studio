import { sveltify } from '@svelte-preprocess-react';
import { type GetProps, Radio as ARadio, theme } from 'antd';

export const Radio = sveltify<
  GetProps<typeof ARadio.Button> & {
    onValueChange: (value: boolean) => void;
  }
>(({ onValueChange, onChange, elRef, style, ...props }) => {
  const { token } = theme.useToken();

  return (
    <ARadio.Button
      {...props}
      style={
        {
          ...style,
          '--ms-gr-antd-line-width': token.lineWidth + 'px',
        } as React.CSSProperties
      }
      ref={elRef}
      onChange={(e) => {
        onChange?.(e);
        onValueChange(e.target.checked);
      }}
    />
  );
});

export default Radio;
