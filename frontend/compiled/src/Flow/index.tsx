import { createSelector } from '@subscribe-kit/react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowInstance,
  updateEdge,
} from '@xyflow/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Store } from '@subscribe-kit/core';
import { theme as AntdTheme } from 'antd';
import cls from 'classnames';

import { defineComponent } from '../defineComponent';
import { useRefValue } from '../shared';
import { safeParseJSON } from '../utils';

import { ConnectionLine } from './flow-components/ConnectionLine';
import { Controls } from './flow-components/Controls';
import { Edge } from './flow-components/Edge';
import { Node } from './flow-components/Node';
import { Sidebar } from './flow-components/Sidebar';
import { FlowContext, FlowContextValue } from './FlowContext';
import type {
  FlowDragData,
  FlowEdge,
  FlowNode,
  FlowNodeSchema,
  FlowStoreData,
  ReactFlowProps,
} from './type';
import { attrItemMatcher, attrMatcher, createId } from './utils';

import '@xyflow/react/dist/style.css';
import './index.less';

export * from './type';

export interface FlowProps {
  on_upload: FlowContextValue['onUpload'];
  custom_components: FlowContextValue['custom_components'];
  on_custom: FlowContextValue['on_custom'];
  schema: FlowContextValue['flowSchema'];
  nodes: FlowNode[];
  edges: FlowEdge[];
  disabled?: boolean;
  theme?: 'dark' | 'light';
  on_change?: (
    value: {
      nodes: FlowNode[];
      edges: FlowEdge[];
    },
    data_changed?: boolean
  ) => void;
  show_sidebar?: boolean;
  show_minimap?: boolean;
  show_controls?: boolean;
  min_zoom?: number;
  max_zoom?: number;
  hide_attribution?: boolean;
}

const edgeTypes: ReactFlowProps['edgeTypes'] = {
  'ms-edge': Edge,
};

const nodeTypes: ReactFlowProps['nodeTypes'] = {
  'ms-node': Node,
};

const defaultSchema: FlowProps['schema'] = {
  nodes: [],
};

export const Flow = defineComponent<FlowProps>((props) => {
  const {
    disabled,
    schema,
    theme = 'light',
    max_zoom: maxZoom = 2,
    min_zoom: minZoom = 0.1,
    show_sidebar = true,
    show_controls = true,
    show_minimap = true,
    nodes = [],
    edges = [],
    on_upload,
    locale = 'en-US',
    on_change,
    on_custom,
    custom_components,
    className,
    style,
    hide_attribution,
  } = props;
  const { token } = AntdTheme.useToken();
  const onChangeRef = useRefValue(on_change);
  const nodesRef = useRefValue(nodes);
  const edgesRef = useRefValue(edges);
  const edgeUpdateSuccessfulRef = useRef(true);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    FlowNode,
    FlowEdge
  > | null>(null);
  const undeletableNodes = useMemo(() => {
    return schema.nodes.reduce(
      (prev, cur) => {
        if (cur.deletable === false) {
          prev[cur.name] = cur;
        }
        return prev;
      },
      {} as Record<string, FlowNodeSchema>
    );
  }, [schema.nodes]);
  const { flowStore, useFlowStore } = useMemo(() => {
    const store = new Store<FlowStoreData>({
      initialValues: {
        nodeCounts: {},
      },
    });

    return {
      flowStore: store,
      useFlowStore: createSelector({ store }).useSelector,
    };
  }, []);

  const setNodes: FlowContextValue['setNodes'] = useCallback((cb, options) => {
    const newNodes = cb(nodesRef.current);
    if (options?.updateNodeCounts) {
      const newNodeCounts = newNodes.reduce(
        (prev, cur) => {
          if (!prev[cur.data.name]) {
            prev[cur.data.name] = 0;
          }
          prev[cur.data.name]++;
          return prev;
        },
        {} as Record<string, number>
      );
      flowStore.setValue('nodeCounts', newNodeCounts);
    }
    onChangeRef.current?.(
      {
        nodes: newNodes,
        edges: edgesRef.current,
      },
      options?.dataChanged
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setEdges: FlowContextValue['setEdges'] = useCallback((cb, options) => {
    const newEdges = cb(edgesRef.current);

    onChangeRef.current?.(
      {
        nodes: nodesRef.current,
        edges: newEdges,
      },
      options?.dataChanged
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNodesChange: ReactFlowProps['onNodesChange'] = (changes) => {
    const isEditChange = changes.some(
      (c) => c.type === 'add' || c.type === 'remove' || c.type === 'replace'
    );
    setNodes(
      (nds) => {
        const newNodes = applyNodeChanges(changes, nds);
        return newNodes;
      },
      {
        updateNodeCounts: isEditChange,
        dataChanged: isEditChange,
      }
    );
  };

  const onEdgesChange: ReactFlowProps['onEdgesChange'] = (changes) => {
    const isEditChange = changes.some(
      (c) => c.type === 'add' || c.type === 'remove' || c.type === 'replace'
    );
    setEdges(
      (eds) => {
        const newEdges = applyEdgeChanges(changes, eds);
        return newEdges;
      },
      {
        dataChanged: isEditChange,
      }
    );
  };

  const onConnect: ReactFlowProps['onConnect'] = (params) => {
    const [, sourceAttr] = params.sourceHandle?.match(attrMatcher) || [];
    const [, sourceAttrItem] = sourceAttr
      ? params.sourceHandle?.match(attrItemMatcher) || [null, null]
      : [null, null];
    const [, targetAttr] = params.targetHandle?.match(attrMatcher) || [
      null,
      null,
    ];
    const [, targetAttrItem] = targetAttr
      ? params.targetHandle?.match(attrItemMatcher) || [null, null]
      : [null, null];

    setEdges(
      (eds) => {
        return addEdge(
          {
            ...params,
            type: 'ms-edge',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: token.colorPrimary,
            },
            data: {
              source: params.source,
              target: params.target,
              sourcePort: sourceAttr
                ? {
                    attr: sourceAttr,
                    index: sourceAttrItem ? +sourceAttrItem : undefined,
                  }
                : undefined,
              targetPort: targetAttr
                ? {
                    attr: targetAttr,
                    index: targetAttrItem ? +targetAttrItem : undefined,
                  }
                : undefined,
            },
            zIndex: 1001,
          },
          eds
        );
      },
      {
        dataChanged: true,
      }
    );
  };
  const onEdgeUpdateStart: ReactFlowProps['onEdgeUpdateStart'] = () => {
    edgeUpdateSuccessfulRef.current = false;
  };

  const onEdgeUpdate: ReactFlowProps['onEdgeUpdate'] = (
    oldEdge,
    newConnection
  ) => {
    edgeUpdateSuccessfulRef.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els), {
      dataChanged: true,
    });
  };

  const onEdgeUpdateEnd: ReactFlowProps['onEdgeUpdateEnd'] = (_, edge) => {
    if (!edgeUpdateSuccessfulRef.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id), {
        dataChanged: true,
      });
    }

    edgeUpdateSuccessfulRef.current = true;
  };

  const onDrop: ReactFlowProps['onDrop'] = (e) => {
    if (!reactFlowInstance) {
      return;
    }

    e.preventDefault();

    const data = e.dataTransfer.getData('ms-flow-drop-data');

    // check if the dropped element is valid
    if (!data) {
      return;
    }

    const { name, template } = safeParseJSON<FlowDragData>(data, {
      name: '',
      template: {},
    });

    const position = reactFlowInstance.screenToFlowPosition({
      x: e.clientX,
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
            name,
            attrs: template?.attrs,
          },
        },
      ],
      {
        dataChanged: true,
        updateNodeCounts: true,
      }
    );
  };

  const onDragOver: ReactFlowProps['onDragOver'] = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // eslint-disable-next-line require-await
  const onBeforeDelete: ReactFlowProps['onBeforeDelete'] = async (params) => {
    return {
      edges: params.edges,
      nodes: params.nodes.filter((n) => !undeletableNodes[n.data.name]),
    };
  };

  const isValidConnection: ReactFlowProps['isValidConnection'] = (
    connection
  ) => {
    const sourceNode = reactFlowInstance?.getNode(connection.source);
    const targetNode = reactFlowInstance?.getNode(connection.target);
    if (!sourceNode || !targetNode) {
      return false;
    }
    const sourceNodeSchema = schema.nodes.find(
      (node) => node.name === sourceNode.data.name
    );
    const targetNodeSchema = schema.nodes.find(
      (node) => node.name === targetNode.data.name
    );
    if (!sourceNodeSchema || !targetNodeSchema) {
      return false;
    }
    const [, sourceAttr] = connection.sourceHandle?.match(attrMatcher) || [
      null,
      null,
    ];
    const [, targetAttr] = connection.targetHandle?.match(attrMatcher) || [
      null,
      null,
    ];
    const sourceConnections = sourceAttr
      ? sourceNodeSchema.attrs?.find((attr) => attr.name === sourceAttr)?.ports
          ?.sourceConnections
      : sourceNodeSchema.ports?.sourceConnections;
    const targetConnections = targetAttr
      ? targetNodeSchema.attrs?.find((attr) => attr.name === targetAttr)?.ports
          ?.targetConnections
      : targetNodeSchema.ports?.targetConnections;
    // judge if the connection is valid
    if (
      (!sourceConnections ||
        (sourceConnections &&
          sourceConnections.some((conn) => {
            // only for node
            if (typeof conn === 'string') {
              return conn === targetNodeSchema.name;
            }
            // for node and node attrs
            return (
              conn.name === targetNodeSchema.name &&
              targetAttr &&
              conn.attrs?.includes(targetAttr)
            );
          }))) &&
      (!targetConnections ||
        (targetConnections &&
          targetConnections.some((conn) => {
            if (typeof conn === 'string') {
              return conn === sourceNodeSchema.name;
            }
            return (
              conn.name === sourceNodeSchema.name &&
              sourceAttr &&
              conn.attrs?.includes(sourceAttr)
            );
          })))
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className={cls('ms-flow', className)} style={style}>
      <FlowContext.Provider
        value={useMemo(() => {
          return {
            theme,
            maxZoom,
            minZoom,
            disabled,
            onUpload: on_upload,
            useFlowStore,
            setEdges,
            setNodes,
            locale,
            on_custom,
            custom_components,
            flowSchema: {
              ...defaultSchema,
              ...schema,
            },
          };
        }, [
          theme,
          maxZoom,
          minZoom,
          disabled,
          on_upload,
          useFlowStore,
          setEdges,
          setNodes,
          locale,
          on_custom,
          custom_components,
          schema,
        ])}
      >
        <ReactFlow<FlowNode, FlowEdge>
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={{
            hideAttribution: !!hide_attribution,
          }}
          nodesDraggable={!disabled}
          nodesConnectable={!disabled}
          elementsSelectable={!disabled}
          nodes={nodes}
          onBeforeDelete={onBeforeDelete}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onNodesChange={onNodesChange}
          isValidConnection={isValidConnection}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          fitView
          onDrop={onDrop}
          onDragOver={onDragOver}
          connectionLineComponent={ConnectionLine}
          minZoom={minZoom}
          maxZoom={maxZoom}
          nodesFocusable={false}
          colorMode={theme}
        >
          {show_sidebar && <Sidebar />}
          <Background />
          {show_controls && <Controls />}
          {show_minimap && <MiniMap position="top-right" />}
        </ReactFlow>
      </FlowContext.Provider>
    </div>
  );
});

export default Flow;
