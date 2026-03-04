import * as internalReactContext from './react-contexts';
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

import './polyfills';

import type { TreeNode } from './internal/types';

declare global {
  interface Window {
    ms_globals: {
      dispatch: (...args: any[]) => void;
      // libs
      React: typeof React;
      ReactDOM: typeof ReactDOM;
      ReactDOMClient: typeof ReactDOMClient;
      antd: typeof antd;
      antdx: typeof antdx;
      antdCssinjs: typeof antdCssinjs;
      antdIcons: typeof antdIcons;
      dayjs: typeof dayjs;

      internalReactContext: typeof internalReactContext;
      initializePromise: Promise<void> | null;
      initialize: () => void;
      tickPromise: Promise<void> | null;

      // svelte-preprocess-react
      sharedRoot: TreeNode | undefined;
      autokey: number;
      loadingKey: number;
      monacoLoader: typeof monacoLoader | null;
      monacoLoaderPromise: Promise<void> | null;

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
  internalReactContext,
  autokey: 0,
  loadingKey: 0,
  sharedRoot: undefined,
  monacoLoader: loader,
  monacoLoaderPromise: null,
  // render items
  createItemsContext,
  itemsContexts: {},
  components: globalComponents,
  ...(window.ms_globals as Partial<typeof window.ms_globals>),
};

// register custom elements
!customElements.get('react-portal-target') &&
  customElements.define('react-portal-target', class extends HTMLElement {});
!customElements.get('react-child') &&
  customElements.define('react-child', class extends HTMLElement {});
!customElements.get('svelte-slot') &&
  customElements.define('svelte-slot', class extends HTMLElement {});

if (!window.ms_globals.initializePromise) {
  window.ms_globals.initializePromise = new Promise((resolve) => {
    window.ms_globals.initialize = () => {
      resolve();
    };
  });
}
window.ms_globals.initialize();
