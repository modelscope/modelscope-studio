import { Panel, useReactFlow, useViewport } from '@xyflow/react';
import React, { useMemo } from 'react';
import {
  FullscreenOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Select, SelectProps, Space } from 'antd';

import { useFlow } from '../FlowContext';

export const Controls: React.FC = () => {
  const reactFlow = useReactFlow();
  const { zoom } = useViewport();
  const { maxZoom, minZoom } = useFlow();

  const zoomOptions: Required<SelectProps>['options'] = useMemo(() => {
    const defaultItems = [0.25, 0.5, 1, 1.5, 2];

    return Array.from(new Set([minZoom, ...defaultItems, maxZoom]))
      .filter((value) => value <= maxZoom && value >= minZoom)
      .map((value) => ({
        label: `${(value * 100).toFixed(0)}%`,
        value,
      }));
  }, [maxZoom, minZoom]);
  return (
    <Panel position="bottom-right">
      <Card
        className="ms-flow-controls"
        styles={{
          body: {
            padding: 10,
          },
        }}
      >
        <Space>
          <Button
            title="Zoom Out"
            icon={<MinusOutlined />}
            disabled={zoom <= minZoom}
            onClick={() => {
              reactFlow.zoomOut();
            }}
          />
          <Select
            className="ms-flow-controls-zoom-select"
            value={zoom}
            labelRender={() => {
              return `${(zoom * 100).toFixed(0)}%`;
            }}
            options={zoomOptions}
            onChange={(value) => {
              reactFlow.zoomTo(value);
            }}
          />
          <Button
            title="Zoom In"
            disabled={zoom >= maxZoom}
            icon={<PlusOutlined />}
            onClick={() => {
              reactFlow.zoomIn();
            }}
          />
          <Button
            title="Fit View"
            icon={<FullscreenOutlined />}
            onClick={() => {
              reactFlow.fitView();
            }}
          />
        </Space>
      </Card>
    </Panel>
  );
};
