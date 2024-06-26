import { Panel, useReactFlow } from '@xyflow/react';
import React, { useState } from 'react';
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, theme } from 'antd';
import cls from 'classnames';

import { isMobile } from '../../utils';
import { useFlow } from '../FlowContext';
import type { FlowDragData, FlowNodeSchema } from '../type';
import { createId } from '../utils';

export const Sidebar: React.FC = () => {
  const {
    flowSchema,
    setNodes,
    disabled: flowDisabled,
    useFlowStore,
  } = useFlow();
  const [collapse, setCollapse] = useState(isMobile);
  const reactFlow = useReactFlow();
  const { token } = theme.useToken();
  const { nodeCounts } = useFlowStore((state) => ({
    nodeCounts: state.nodeCounts,
  }));
  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    nodeSchema: FlowNodeSchema
  ) => {
    e.dataTransfer.setData(
      'ms-flow-drop-data',
      JSON.stringify({
        name: nodeSchema.name,
        template: nodeSchema.template,
      } as FlowDragData)
    );
    e.dataTransfer.effectAllowed = 'move';
  };
  return (
    <Panel
      position="top-left"
      className={cls('ms-flow-sidebar', collapse && 'ms-flow-sidebar-collapse')}
      style={{
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        backgroundColor: token.colorBgElevated,
      }}
    >
      <div
        className={cls(
          'ms-flow-sidebar-handle',
          collapse && 'ms-flow-sidebar-handle-collapse'
        )}
      >
        <Button
          onClick={() => {
            setCollapse(!collapse);
          }}
          icon={collapse ? <CaretRightOutlined /> : <CaretLeftOutlined />}
          size="small"
        />
      </div>
      <div className="ms-flow-sidebar-list">
        {flowSchema.nodes.map((nodeSchema, index) => {
          if (nodeSchema.addable === false) {
            return null;
          }
          const disabled =
            flowDisabled ||
            (typeof nodeSchema.max === 'number' &&
              nodeCounts[nodeSchema.name] >= nodeSchema.max);

          return (
            <Card
              draggable={!disabled}
              hoverable={!disabled}
              style={{
                backgroundColor: disabled
                  ? token.colorBgContainerDisabled
                  : undefined,
                cursor: disabled ? 'not-allowed' : undefined,
              }}
              onDragStart={(e) => onDragStart(e, nodeSchema)}
              className="ms-flow-sidebar-item"
              key={`${nodeSchema.name}-${index}`}
              styles={{
                body: {
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                },
              }}
            >
              <h3 className="ms-flow-sidebar-item-header">
                <div className="ms-flow-sidebar-item-header-title">
                  {nodeSchema.icon && (
                    <img
                      src={nodeSchema.icon}
                      alt={nodeSchema.title || nodeSchema.name}
                    />
                  )}
                  {nodeSchema.title || nodeSchema.name}
                </div>
                <Button
                  className="ms-flow-sidebar-item-header-add"
                  size="small"
                  icon={<PlusOutlined />}
                  disabled={disabled}
                  onClick={(e) => {
                    const position = reactFlow.screenToFlowPosition({
                      x: e.clientX + 60,
                      y: e.clientY,
                    });

                    setNodes(
                      (nds) => [
                        ...nds.map((nd) => ({ ...nd, selected: false })),
                        {
                          id: createId(),
                          type: 'ms-node',
                          position,
                          selected: true,
                          data: {
                            name: nodeSchema.name,
                            attrs: nodeSchema.template?.attrs,
                          },
                        },
                      ],
                      {
                        dataChanged: true,
                        updateNodeCounts: true,
                      }
                    );
                  }}
                />
              </h3>
              {nodeSchema.description && (
                <p
                  style={{ color: token.colorTextDescription }}
                  className="ms-flow-sidebar-item-desc"
                >
                  {nodeSchema.description}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </Panel>
  );
};
