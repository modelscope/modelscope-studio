import type { EdgeProps } from '@xyflow/react';
import { getBezierPath } from '@xyflow/react';
import React from 'react';
import { theme } from 'antd';

export const Edge: React.FC<EdgeProps> = (props) => {
  const {
    sourceX,
    sourcePosition,
    targetPosition,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    source,
    target,
  } = props;
  const { token } = theme.useToken();

  const radiusX = (sourceX - targetX) * 0.6;
  const radiusY = 50;
  const edgePath = `M ${sourceX - 5} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
    targetX + 2
  } ${targetY}`;

  if (source === target) {
    return (
      <g>
        <path
          d={edgePath}
          fill="none"
          strokeWidth={2}
          stroke={token.colorPrimary}
          markerEnd={markerEnd}
        />
      </g>
    );
  }

  const [d] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <g>
      <path
        fill="none"
        strokeWidth={2}
        stroke={token.colorPrimary}
        d={d}
        markerEnd={markerEnd}
      />
    </g>
  );
};
