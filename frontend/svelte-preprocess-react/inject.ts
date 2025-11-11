import type { loader as monacoLoader } from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMClient from 'react-dom/client';
import * as antdCssinjs from '@ant-design/cssinjs';
import * as antdIcons from '@ant-design/icons';
import * as antdx from '@ant-design/x';
import * as globalComponents from '@globals/components';
import * as createItemsContext from '@utils/createItemsContext';
import * as antd from 'antd';
import dayjs from 'dayjs';
import { noop } from 'lodash-es';
import { type Readable, type Writable, writable } from 'svelte/store';

import './events-polyfills';
import './polyfills';

import type { BridgeProps } from './internal/Bridge';
import Bridge from './internal/Bridge';
import type { TreeNode } from './internal/types';
import * as internalContext from './context';

declare global {
  interface Window {
    ms_globals: {
      dispatch: (...args: any[]) => void;
      React: typeof React;
      ReactDOM: typeof ReactDOM;
      ReactDOMClient: typeof ReactDOMClient;
      antd: typeof antd;
      antdx: typeof antdx;
      antdCssinjs: typeof antdCssinjs;
      antdIcons: typeof antdIcons;
      dayjs: typeof dayjs;
      internalContext: typeof internalContext;
      initializePromise: Promise<void> | null;
      initialize: () => void;
      tickPromise: Promise<void> | null;
      // svelte-preprocess-react
      target: Writable<HTMLElement>;
      tree: TreeNode;
      autokey: number;
      loadingKey: number;
      monacoLoader: typeof monacoLoader | null;
      monacoLoaderPromise: Promise<void> | null;
      rerender: (props: BridgeProps) => void;
      // render items
      createItemsContext: typeof createItemsContext;
      itemsContexts: Record<
        string,
        ReturnType<typeof createItemsContext.createItemsContext>
      >;
      // globals
      components: typeof globalComponents;
    };
  }
}

// initialize global variables
const target = writable<HTMLElement>();
const never = writable() as Readable<any>;

const rootEl = document.createElement('react-root');
// global root
const root = ReactDOMClient.createRoot(rootEl);
const targetEl = document.createElement('bridge-root');
target.set(targetEl);
document.head.appendChild(rootEl);
document.head.appendChild(targetEl);
const rerender = (props: BridgeProps) => {
  root.render(React.createElement(Bridge, props));
};

window.ms_globals ??= {} as typeof window.ms_globals;

window.ms_globals = {
  dispatch: noop,
  initialize: noop,
  tickPromise: null,
  initializePromise: null,
  React,
  ReactDOM,
  ReactDOMClient,
  antd,
  antdx,
  antdCssinjs,
  antdIcons,
  dayjs,
  internalContext,
  autokey: 0,
  loadingKey: 0,
  target,
  tree: {
    key: 0,
    svelteInstance: never,
    reactComponent: ({ children }: any) => children,
    target,
    props: writable({}),
    slot: never,
    slotKey: undefined,
    slotIndex: undefined,
    subSlotIndex: undefined,
    nodes: [],
  },
  rerender,
  monacoLoader: loader,
  monacoLoaderPromise: null,
  // render items
  createItemsContext,
  itemsContexts: {},
  components: globalComponents,
  ...(window.ms_globals as Partial<typeof window.ms_globals>),
};
// register custom elements
customElements.define('react-portal-target', class extends HTMLElement {});
customElements.define('react-child', class extends HTMLElement {});
customElements.define('svelte-slot', class extends HTMLElement {});

if (!window.ms_globals.initializePromise) {
  window.ms_globals.initializePromise = new Promise((resolve) => {
    window.ms_globals.initialize = () => {
      resolve();
    };
  });
}
window.ms_globals.initialize();
