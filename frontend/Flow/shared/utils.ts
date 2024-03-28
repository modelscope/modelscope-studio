import { FlowProps } from '@modelscope-studio/compiled';

export interface FlowData {
  nodes?: NonNullable<FlowProps['nodes']>;
  edges?: NonNullable<FlowProps['edges']>;
}

export function createId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 12);
  return timestamp + randomPart;
}
