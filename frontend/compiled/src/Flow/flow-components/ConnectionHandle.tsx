import { Handle, HandleComponentProps } from '@xyflow/react';
import { theme } from 'antd';

export interface ConnectionHandleProps extends HandleComponentProps {}

export const ConnectionHandle: React.FC<ConnectionHandleProps> = (props) => {
  const { token } = theme.useToken();

  const cssVars = {
    '--ms-flow-handle-bg': token.colorPrimary,
    '--ms-flow-handle-bg-error': token.colorError,
    '--ms-flow-handle-bg-success': token.colorSuccess,
  } as React.CSSProperties;
  return <Handle {...props} style={{ ...cssVars }} />;
};
