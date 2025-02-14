import type { ConnectionLineComponent } from '@xyflow/react';
import { getBezierPath } from '@xyflow/react';
import { theme } from 'antd';

import type { FlowNode } from '../type';

export const ConnectionLine: ConnectionLineComponent<FlowNode> = ({
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
