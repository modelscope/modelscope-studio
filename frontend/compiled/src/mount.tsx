import React from 'react';
import ReactDOM from 'react-dom/client';

import type { ComponentConfigProviderProps } from './ComponentConfigProvider';
import { ComponentConfigProvider } from './ComponentConfigProvider';

export function mount<T extends {}>(
  container: HTMLElement,
  Component: React.ComponentType<T>,
  props: ComponentConfigProviderProps & T,
  root?: ReactDOM.Root
) {
  const _root = root || ReactDOM.createRoot(container);
  _root.render(
    <ComponentConfigProvider locale={props.locale} theme={props.theme}>
      <Component {...props} />
    </ComponentConfigProvider>
  );
  return _root;
}
