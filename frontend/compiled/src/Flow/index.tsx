import { createSelector } from '@subscribe-kit/react';
import type { BackgroundProps, ReactFlowInstance } from '@xyflow/react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  MarkerType,
  MiniMap,
  ReactFlow,
  reconnectEdge,
} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Store } from '@subscribe-kit/core';
import { theme as AntdTheme } from 'antd';
import cls from 'classnames';
import { isNumber, isObject } from 'lodash-es';

import { defineComponent } from '../defineComponent';
import { useMemoizedEqualValue, useRefValue } from '../shared';
import { isMobile, safeParseJSON } from '../utils';

import { ConnectionLine } from './flow-components/ConnectionLine';
import { Controls } from './flow-components/Controls';
import { Edge } from './flow-components/Edge';
import { Node } from './flow-components/Node';
import { Sidebar } from './flow-components/Sidebar';
import type { FlowContextValue } from './FlowContext';
import { FlowContext } from './FlowContext';
import type {
  FlowDragData,
  FlowEdge,
  FlowNode,
  FlowNodeSchema,
  FlowRenderData,
  FlowStoreData,
  ReactFlowProps,
} from './type';
import {
  createId,
  flowData2RenderData,
  parseHandleIdObject,
  renderData2FlowData,
} from './utils';

import '@xyflow/react/dist/style.css';
import './index.less';

export type * from './type';

export interface FlowProps {
  on_upload: FlowContextValue['onUpload'];
  custom_components: FlowContextValue['custom_components'];
  on_custom: FlowContextValue['on_custom'];
  schema: FlowContextValue['flowSchema'];
  nodes: FlowNode[];
  edges: FlowEdge[];
  disabled?: boolean;
  theme?: 'dark' | 'light';
  on_change?: (value: FlowRenderData, data_changed?: boolean) => void;
  show_sidebar?: boolean;
  show_minimap?: boolean;
  show_controls?: boolean;
  background_props?: BackgroundProps | BackgroundProps[];
  min_zoom?: number;
  max_zoom?: number;
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

const initialNodes: FlowNode[] = [];
const initialEdges: FlowEdge[] = [];

export const Flow = defineComponent<FlowProps>((props) => {
  const {
    disabled,
    schema: userSchema,
    theme = 'light',
    max_zoom: maxZoom = 2,
    min_zoom: minZoom = 0.1,
    show_sidebar = true,
    show_controls = true,
    show_minimap = !isMobile(),
    nodes: userNodes = initialNodes,
    edges: userEdges = initialEdges,
    on_upload,
    locale = 'en-US',
    on_change,
    on_custom,
    custom_components,
    className,
    style,
    background_props,
  } = props;
  const id = useMemo(() => {
    return createId();
  }, []);
  const schema = useMemoizedEqualValue(userSchema);

  const { token } = AntdTheme.useToken();
  const onChangeRef = useRefValue(on_change);
  const { nodes, edges } = useMemo(() => {
    return renderData2FlowData(
      {
        nodes: userNodes,
        edges: userEdges,
      },
      {
        markerEndColor: token.colorPrimary,
      }
    );
  }, [token.colorPrimary, userEdges, userNodes]);
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

  const nodesSchema = useMemo(() => {
    return (schema.nodes || []).reduce(
      (acc, node) => {
        acc[node.name] = node;
        return acc;
      },
      {} as Record<string, FlowNodeSchema>
    );
  }, [schema.nodes]);
  const { flowStore, useFlowStore } = useMemo(() => {
    const store = new Store<FlowStoreData>({
      initialValues: {
        nodeCounts: {},
        nodesString: '',
      },
    });

    return {
      flowStore: store,
      useFlowStore: createSelector({ store }).useSelector,
    };
  }, []);

  const updateNodeCounts = useCallback(
    (newNodes: FlowNode[]) => {
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
      flowStore.setValues((draft) => {
        draft.nodeCounts = newNodeCounts;
        draft.nodesString = JSON.stringify(newNodes);
      });
    },
    [flowStore]
  );

  // update node counts when nodes changed
  useEffect(() => {
    updateNodeCounts(nodes);
  }, [nodes, updateNodeCounts]);

  const setNodes: FlowContextValue['setNodes'] = useCallback((cb, options) => {
    const newNodes = cb(nodesRef.current);
    // perf: optimize
    // if (options?.updateNodeCounts) {
    //   updateNodeCounts(newNodes);
    // }

    onChangeRef.current?.(
      flowData2RenderData({
        nodes: newNodes,
        edges: edgesRef.current,
      }),
      options?.dataChanged
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setEdges: FlowContextValue['setEdges'] = useCallback((cb, options) => {
    const newEdges = cb(edgesRef.current);

    onChangeRef.current?.(
      flowData2RenderData({
        nodes: nodesRef.current,
        edges: newEdges,
      }),
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
  const onReconnectStart: ReactFlowProps['onReconnectStart'] = () => {
    edgeUpdateSuccessfulRef.current = false;
  };

  const onReconnect: ReactFlowProps['onReconnect'] = (
    oldEdge,
    newConnection
  ) => {
    edgeUpdateSuccessfulRef.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els), {
      dataChanged: true,
    });
  };

  const onReconnectedEnd: ReactFlowProps['onReconnectEnd'] = (_, edge) => {
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
      nodes: params.nodes.filter((n) => {
        // if deletable or schema.min < the node count
        const isUndeleteableNode = undeletableNodes[n.data.name];
        if (isUndeleteableNode) {
          return false;
        }
        const nodeSchema = nodesSchema[n.data.name];

        return (
          !isNumber(nodeSchema.min) ||
          nodeSchema.min < flowStore.values.nodeCounts[n.data.name]
        );
      }),
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
    const sourceNodeSchema = nodesSchema[sourceNode.data.name];
    const targetNodeSchema = nodesSchema[targetNode.data.name];

    if (!sourceNodeSchema || !targetNodeSchema) {
      return false;
    }

    const { attr: sourceAttr, attrItemIndex: sourceAttrItem } =
      parseHandleIdObject(connection.sourceHandle || '');
    const { attr: targetAttr, attrItemIndex: targetAttrItem } =
      parseHandleIdObject(connection.targetHandle || '');

    const getSourceConnections = () => {
      if (sourceAttrItem) {
        const listOptions = sourceNodeSchema.attrs?.find(
          (attr) => attr.name === sourceAttr
        )?.list;
        if (isObject(listOptions)) {
          return listOptions.ports?.sourceConnections;
        }
        return;
      }
      if (sourceAttr) {
        return sourceNodeSchema.attrs?.find((attr) => attr.name === sourceAttr)
          ?.ports?.sourceConnections;
      }
      return sourceNodeSchema.ports?.sourceConnections;
    };

    const getTargetConnections = () => {
      if (targetAttrItem) {
        const listOptions = targetNodeSchema.attrs?.find(
          (attr) => attr.name === targetAttr
        )?.list;
        if (isObject(listOptions)) {
          return listOptions.ports?.targetConnections;
        }
        return;
      }
      if (targetAttr) {
        return targetNodeSchema.attrs?.find((attr) => attr.name === targetAttr)
          ?.ports?.targetConnections;
      }
      return targetNodeSchema.ports?.targetConnections;
    };

    const sourceConnections = getSourceConnections();
    const targetConnections = getTargetConnections();
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
            nodesSchema,
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
          nodesSchema,
          schema,
        ])}
      >
        <ReactFlow<FlowNode, FlowEdge>
          nodeTypes={nodeTypes}
          id={`flow_${id}`}
          edgeTypes={edgeTypes}
          proOptions={{
            hideAttribution: true,
          }}
          nodesDraggable={!disabled}
          nodesConnectable={!disabled}
          elementsSelectable={!disabled}
          nodes={nodes}
          onBeforeDelete={onBeforeDelete}
          onReconnectStart={onReconnectStart}
          onReconnect={onReconnect}
          onReconnectEnd={onReconnectedEnd}
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
          {Array.isArray(background_props) ? (
            background_props.map((item, index) => (
              <Background id={`${index}`} key={index} {...item} />
            ))
          ) : (
            <Background {...background_props} />
          )}
          {show_controls && <Controls />}
          {show_minimap && <MiniMap position="top-right" />}
        </ReactFlow>
      </FlowContext.Provider>
    </div>
  );
});

export default Flow;
