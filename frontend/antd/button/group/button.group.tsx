import { sveltify } from '@svelte-preprocess-react';
import { Button as AButton, type GetProps, theme } from 'antd';

import './button.group.less';

export const ButtonGroup = sveltify<
  GetProps<typeof AButton.Group> & {
    id?: string;
  }
>(({ style, ...props }) => {
  const { token } = theme.useToken();

  return (
    <AButton.Group
      {...props}
      style={
        {
          ...style,
          '--ms-gr-antd-line-width': token.lineWidth + 'px',
        } as React.CSSProperties
      }
    />
  );
});

export default ButtonGroup;
