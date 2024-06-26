import type { createSelector } from '@subscribe-kit/react';
import { createContext, useContext } from 'react';

import type { CustomComponents } from '../shared';

import type {
  FlowCustomData,
  FlowEdge,
  FlowNode,
  FlowNodeSchema,
  FlowSchema,
  FlowStoreData,
  UploadFile,
} from './type';

export interface FlowContextValue {
  theme: 'light' | 'dark';
  disabled?: boolean;
  locale: string;
  custom_components: CustomComponents;
  on_custom: (options: FlowCustomData) => void;
  maxZoom: number;
  minZoom: number;
  onUpload?: (files: File[]) => Promise<UploadFile[]>;
  flowSchema: FlowSchema;
  nodesSchema: Record<string, FlowNodeSchema>;
  setNodes: (
    value: (nodes: FlowNode[]) => FlowNode[],
    options?: { updateNodeCounts?: boolean; dataChanged?: boolean }
  ) => void;
  setEdges: (
    value: (edges: FlowEdge[]) => FlowEdge[],
    options?: { dataChanged?: boolean }
  ) => void;
  useFlowStore: ReturnType<typeof createSelector<FlowStoreData>>['useSelector'];
}
export const FlowContext = createContext<FlowContextValue>({
  useFlowStore: (() => {
    throw new Error('invalid implemented');
  }) as unknown as FlowContextValue['useFlowStore'],
  maxZoom: 2,
  minZoom: 0.1,
  setEdges: () => {},
  setNodes: () => {},
  flowSchema: {
    nodes: [],
  },
  nodesSchema: {},
  theme: 'light',
  locale: 'en-US',
  on_custom: () => {},
  custom_components: {},
});

export function useFlow() {
  return useContext(FlowContext);
}
