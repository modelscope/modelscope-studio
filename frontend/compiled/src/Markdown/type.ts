export interface CustomComponents {
  [component: string]: {
    template?: string;
    js?: string;
    props?: string[];
  };
}
export interface CustomData {
  tag: string;
  tag_index: number;
  value?: any;
}
