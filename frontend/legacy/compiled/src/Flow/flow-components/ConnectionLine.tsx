import type { ConnectionLineComponent } from '@xyflow/react';
import { getBezierPath } from '@xyflow/react';
import { theme } from 'antd';

export const ConnectionLine: ConnectionLineComponent = ({
  toX,
  toY,
  fromX,
  fromY,
  fromPosition,
  toPosition,
}) => {
  const { token } = theme.useToken();
  const [d] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path fill="none" strokeWidth={2} stroke={token.colorPrimary} d={d} />
    </g>
  );
};
