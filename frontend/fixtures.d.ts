declare module 'virtual:component-loader' {
  export const load_component;
}

declare module '*?worker' {
  const workerConstructor: {
    new (options?: { name?: string }): Worker;
  };
  export default workerConstructor;
}

declare module '*?worker&inline' {
  const workerConstructor: {
    new (options?: { name?: string }): Worker;
  };
  export default workerConstructor;
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
  _reactElement: React.ReactElement & {
    props: Record<string, any>;
  };
  _effects: ((props: Record<string, any>) => void)[];
  _registerEffect: (cb: (props: Record<string, any>) => void) => () => void;
}

declare module '*.svelte' {
  import type { Component } from 'svelte';

  const component: Component;

  export default component;
}
