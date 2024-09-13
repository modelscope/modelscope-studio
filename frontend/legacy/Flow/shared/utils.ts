import type { FlowRenderData } from '@modelscope-studio/legacy-compiled';

export interface FlowData {
  nodes?: NonNullable<FlowRenderData['nodes']>;
  edges?: NonNullable<FlowRenderData['edges']>;
}
