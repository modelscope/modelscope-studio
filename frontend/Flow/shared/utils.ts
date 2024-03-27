import { FlowProps } from '@modelscope-studio/compiled';

export interface FlowData {
  nodes?: NonNullable<FlowProps['nodes']>;
  edges?: NonNullable<FlowProps['edges']>;
}
