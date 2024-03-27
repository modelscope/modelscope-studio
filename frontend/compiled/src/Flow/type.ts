import {
  type Edge,
  type Node,
  Position,
  type ReactFlowProps as OriginReactFlowProps,
} from '@xyflow/react';
import type { Schema as JSONSchema } from 'ajv';

export type ReactFlowProps = Required<OriginReactFlowProps<FlowNode, FlowEdge>>;

export type Attrs = Record<string, any>;

export interface FlowCustomData {
  value?: any;
  node: string;
  attr: string;
  index?: number;
}

export interface FlowStoreData {
  nodeCounts: Record<string, number>;
}

export type PortConnection =
  | string
  | {
      name: string;
      attrs?: string[];
    };

export interface FlowNodeSchema {
  name: string;
  icon?: string;
  title?: string;
  show_toolbar?: boolean;
  width?: number;
  height?: number;
  addable?: boolean;
  deletable?: boolean;
  // addable will be false when the count of nodes is greater than max
  max?: number;
  // deletable will be false when the count of nodes is less than min
  min?: number;
  description?: string;
  ports?: {
    source?: Position[];
    sourceConnections?: PortConnection[];
    target?: Position[];
    targetConnections?: PortConnection[];
  };
  // TODO
  // attrsGroups?: Array<{
  //   name: string
  //   title?: string
  // }>
  attrs?: Array<{
    name: string;
    title?: string;
    disabled?: boolean;
    description?: string;
    type?:
      | 'input'
      | 'textarea'
      | 'radio'
      | 'checkbox'
      | 'number'
      | 'select'
      | 'switch'
      | 'file'
      // custom
      | (string & {});
    // for antd component props
    props?: Record<string, any>;
    // for radio, checkbox, select
    options?: Array<{
      label: string;
      value: string;
    }>;
    ports?: {
      source?: Position[];
      sourceConnections?: PortConnection[];
      target?: Position[];
      targetConnections?: PortConnection[];
    };
    list?:
      | boolean
      | {
          min?: number;
          max?: number;
        };
    is_accordion?: boolean;
    required?:
      | boolean
      | {
          message: string;
        };
    json_schema_validator?: JSONSchema;
    // validators json schema
  }>;
  template?: {
    attrs?: Attrs;
  };
}

export interface FlowDragData {
  name: string;
  template?: FlowNodeSchema['template'];
}

export interface FlowNode extends Node {
  data: {
    attrs?: Attrs;
    title?: string;
    name: string;
  };
}

export interface FlowEdge extends Edge {
  data: {
    source: string;
    target: string;
    sourcePort?: {
      attr: string;
      index?: number;
    };
    targetPort?: {
      attr: string;
      index?: number;
    };
  };
}

export interface ElkPortsId {
  id: string;
  properties: { side: 'WEST' | 'EAST' | 'NORTH' | 'SOUTH' };
}

export interface UploadFile {
  url: string;
  name: string;
}