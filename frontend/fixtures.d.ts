declare module 'virtual:component-loader' {
  export const load_component;
}
declare module '*?inline' {
  const string: string;
  export default string;
}

declare module '*?raw' {
  const string: string;
  export default string;
}

declare module '*css' {}

interface Window {
  __gradio_space__: any;
}

interface Element {
  _reactElement: React.ReactElement;
}

declare module '*.svelte' {
  import type { ComponentType } from 'svelte';

  const component: ComponentType;

  export default component;
}
