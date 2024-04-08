import { FlowRenderData } from '@modelscope-studio/compiled';

export interface FlowData {
  nodes?: NonNullable<FlowRenderData['nodes']>;
  edges?: NonNullable<FlowRenderData['edges']>;
}
