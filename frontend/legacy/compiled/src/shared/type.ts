export interface CustomComponents {
  [component: string]: {
    template?: string;
    js?: string;
    props?: string[];
  };
}
