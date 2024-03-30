import { Position } from '@xyflow/react';
import Ajv, { ErrorObject, Schema as JSONSchema } from 'ajv';
import localize from 'ajv-i18n/localize/zh';
import ELK, { ElkNode } from 'elkjs/lib/elk.bundled';
import { isObject } from 'lodash-es';

import type {
  ElkPortsId,
  FlowEdge,
  FlowNode,
  FlowNodeSchema,
  HandleIdObject,
} from './type';

// ***** Layout *****

export function stringifyHandleIdObject(options: HandleIdObject) {
  return Object.keys(options).reduce((acc, key) => {
    let prefix = '';
    if (acc) {
      prefix += '__$__';
    }
    return acc + prefix + `${key}=${options[key as keyof HandleIdObject]}`;
  }, '');
}

export function parseHandleIdObject(str: string) {
  const handleIdObject = {} as HandleIdObject;
  str.split('__$__').forEach((item) => {
    const [key, ...value] = item.split('=');
    (handleIdObject as any)[key] = value.join('=');
  });
  return handleIdObject;
}

export function getAttrItemHandleId(options: {
  nodeId: string;
  type: 'target' | 'source';
  attr: string;
  attrItemIndex: number;
  handleIndex: number;
}) {
  const { attr, type, nodeId, attrItemIndex, handleIndex } = options;
  // return `${nodeId}-${type}-attr(${attr})-attr_item_index(${attrItemIndex})-${handleIndex}`;
  // sort props
  return stringifyHandleIdObject({
    nodeId,
    type,
    attr,
    attrItemIndex,
    handleIndex,
  });
}

export function getAttrHandleId(options: {
  nodeId: string;
  type: 'target' | 'source';
  attr: string;
  handleIndex: number;
}) {
  const { nodeId, attr, type, handleIndex } = options;
  // return `${nodeId}-${type}-attr(${attr})-${handleIndex}`;
  return stringifyHandleIdObject({
    nodeId,
    type,
    attr,
    handleIndex,
  });
}

export function getHandleId(options: {
  nodeId: string;
  type: 'target' | 'source';
  handleIndex: number;
}) {
  const { nodeId, type, handleIndex } = options;
  // return `${nodeId}-${type}-${handleIndex}`;
  return stringifyHandleIdObject({
    nodeId,
    type,
    handleIndex,
  });
}

const position2side = {
  [Position.Right]: 'EAST',
  [Position.Left]: 'WEST',
  [Position.Top]: 'NORTH',
  [Position.Bottom]: 'SOUTH',
} as const;

const elk = new ELK();

// elk layouting options can be found here:
// https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-layered.html
const layoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.layered.spacing.edgeNodeBetweenLayers': '40',
  'elk.spacing.nodeNode': '40',
  'elk.layered.nodePlacement.strategy': 'SIMPLE',
};

const getPortsIds = (node: FlowNode, schema: FlowNodeSchema): ElkPortsId[] => {
  const combine = (
    ports: [sourcePorts?: Position[], targetPorts?: Position[]]
  ) => {
    return [
      { type: 'source', ports: ports[0] },
      { type: 'target', ports: ports[1] },
    ] as const;
  };
  const sourcePorts = schema.ports?.source || [Position.Right];
  const targetPorts = schema.ports?.target || [Position.Left];
  const portsIds: ElkPortsId[] = [];

  combine([sourcePorts, targetPorts]).forEach(({ type, ports }) => {
    ports?.forEach((port, i) => {
      portsIds.push({
        id: getHandleId({
          nodeId: node.id || '',
          type,
          handleIndex: i,
        }),
        properties: {
          side: position2side[port],
        },
      });
    });
  });

  schema.attrs?.forEach((attr) => {
    combine([attr.ports?.source, attr.ports?.target]).forEach(
      ({ type, ports }) => {
        ports?.forEach((port, handleIndex) => {
          portsIds.push({
            id: getAttrHandleId({
              nodeId: node.id || '',
              attr: attr.name,
              type,
              handleIndex,
            }),
            properties: {
              side: position2side[port],
            },
          });
        });
      }
    );

    if (isObject(attr.list) && attr.list.ports) {
      combine([attr.list.ports.source, attr.list.ports.target]).forEach(
        ({ type, ports }) => {
          ports?.forEach((port, handleIndex) => {
            ((node.data.attrs?.[attr.name] || []) as any[]).forEach(
              (_, attrItemIndex) => {
                portsIds.push({
                  id: getAttrItemHandleId({
                    nodeId: node.id || '',
                    attr: attr.name,
                    type,
                    handleIndex,
                    attrItemIndex,
                  }),
                  properties: {
                    side: position2side[port],
                  },
                });
              }
            );
          });
        }
      );
    }
  });

  return portsIds;
};

export const getLayoutedNodes = async (
  nodes: FlowNode[],
  edges: FlowEdge[],
  getNodeSchema: (node: FlowNode) => FlowNodeSchema
): Promise<FlowNode[]> => {
  const graph: ElkNode = {
    id: 'root',
    layoutOptions,
    children: nodes.map((n) => {
      return {
        id: n.id,
        width: n.width ?? 360,
        height: n.height ?? 200,
        // ⚠️ we need to tell elk that the ports are fixed, in order to reduce edge crossings
        properties: {
          'org.eclipse.elk.portConstraints': 'FIXED_ORDER',
        },
        // we are also passing the id, so we can also handle edges without a sourceHandle or targetHandle option
        ports: getPortsIds(n, getNodeSchema(n)),
      };
    }),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.sourceHandle || e.source],
      targets: [e.targetHandle || e.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes: FlowNode[] = nodes.map((node) => {
    const layoutedNode = layoutedGraph.children?.find(
      (lgNode) => lgNode.id === node.id
    );

    return {
      ...node,
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0,
      },
    };
  });

  return layoutedNodes;
};

// ***** Layout *****

// ***** validation *****
const ajv = new Ajv();

const ajvLocales: Record<string, typeof localize> = {
  'zh-CN': localize,
};

export function compileValidationSchema(schema: JSONSchema) {
  try {
    return ajv.compile(schema);
  } catch (error) {
    return null;
  }
}

export function getValidationErrorMessage(
  errors:
    | ErrorObject<string, Record<string, any>, unknown>[]
    | null
    | undefined,
  locale?: string
) {
  if (locale && ajvLocales[locale]) {
    ajvLocales[locale](errors);
  }
  return ajv.errorsText(errors, { separator: '\n' });
}

// ***** validation *****

// ***** data *****
// TODO: convert data
export function flowData2RenderData() {}

export function renderData2FlowData(nodes: FlowNode[], edges: FlowEdge[]) {}

// ***** data *****

// ***** misc *****

export function updateNodeAttrs(
  node: FlowNode,
  attrs: Record<string, any>,
  replace = false
): FlowNode {
  return {
    ...node,
    data: {
      ...node.data,
      attrs: replace
        ? attrs
        : {
            ...(
              node.data as {
                attrs: Record<string, any>;
              }
            ).attrs,
            ...attrs,
          },
    },
  };
}

export function createId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 12);
  return timestamp + randomPart;
}

// ***** misc *****
