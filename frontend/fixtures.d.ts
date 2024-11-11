declare module 'virtual:component-loader' {
  export const load_component;
}
declare module '*?inline' {
  const string: string;
  export default string;
}

interface Window {
  __gradio_space__: any;
}

interface Element {
  _reactElement: React.ReactElement;
}
