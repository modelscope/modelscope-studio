import { Panel, useReactFlow, useViewport } from '@xyflow/react';
import React, { useMemo } from 'react';
import {
  FullscreenOutlined,
  LayoutOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Select, SelectProps, Space } from 'antd';

import { useFlow } from '../FlowContext';
import { FlowEdge, FlowNode, FlowNodeSchema } from '../type';
import { getLayoutedNodes } from '../utils';

export const Controls: React.FC = () => {
  const reactFlow = useReactFlow<FlowNode, FlowEdge>();
  const { zoom } = useViewport();
  const { maxZoom, minZoom } = useFlow();

  const { setNodes, flowSchema } = useFlow();
  const nodesSchema = useMemo(() => {
    return flowSchema.nodes.reduce(
      (acc, node) => {
        acc[node.name] = node;
        return acc;
      },
      {} as Record<string, FlowNodeSchema>
    );
  }, [flowSchema.nodes]);

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
          <Button
            title="Auto Layout"
            icon={<LayoutOutlined />}
            onClick={async () => {
              const layoutedNodes = await getLayoutedNodes(
                reactFlow.getNodes(),
                reactFlow.getEdges(),
                (node) => {
                  return nodesSchema[node.data.name];
                }
              );
              setNodes(() => layoutedNodes);

              requestAnimationFrame(() => {
                reactFlow.fitView();
              });
            }}
          />
        </Space>
      </Card>
    </Panel>
  );
};
