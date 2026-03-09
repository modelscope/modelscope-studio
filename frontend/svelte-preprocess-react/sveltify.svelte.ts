import React from 'react';
import { createPortal } from 'react-dom';
import ReactDOM from 'react-dom/client';

import Bridge from './internal/Bridge.svelte';
import ReactWrapper from './internal/ReactWrapper.svelte';
import type { SvelteInit, Sveltified, TreeNode } from './internal/types';

type CommonProps<S extends readonly string[] = []> = S extends []
  ? {
      slots: {};
      elRef?: React.ForwardedRef<any>;
      style?: React.CSSProperties;
      className?: string;
      id?: string;
    }
  : {
      slots: {
        [P in S[number]]?: HTMLElement;
      };
      elRef?: React.ForwardedRef<any>;
      style?: React.CSSProperties;
      className?: string;
      id?: string;
    };

/**
 * Convert a React component into a Svelte component.
 */
export function sveltify<P, const S extends readonly string[] = []>(
  reactComponent: React.ComponentType<P & CommonProps<S>>,
  sveltifyOptions: {
    ignore?: boolean;
  } = {}
):
  | Promise<
      Sveltified<Omit<P & CommonProps<S>, 'children'> & { children?: any }>
    >
  | Sveltified<Omit<P & CommonProps<S>, 'children'> & { children?: any }> {
  // svelte components options
  function Sveltified(internals: any, $$props: any) {
    const wrapperProps = {
      componentProps: $$props,
      svelteInit: (init: SvelteInit) => {
        window.ms_globals.autokey += 1;
        const key = window.ms_globals.autokey;
        if (!init.parent && !window.ms_globals.sharedRoot) {
          let portalTarget = $state<HTMLElement | undefined>();
          const rootNode: TreeNode = {
            key,
            reactComponent: ({ children }) => children,
            get portalTarget() {
              return portalTarget;
            },
            props: {},
            slotKey: undefined,
            slotIndex: undefined,
            subSlotIndex: undefined,
            childrenSource: undefined,
            svelteChildren: undefined,
            nodes: [],
          };
          const rootEl = document.createElement('react-root');
          const root = ReactDOM.createRoot(rootEl);
          portalTarget = document.createElement('bridge-root');

          $effect(() => {
            document.head.appendChild(rootEl);
            document.head.appendChild(portalTarget);
            return () => {
              document.head.removeChild(rootEl);
              document.head.removeChild(portalTarget);
            };
          });
          rootNode.rerender = () => {
            root.render(
              React.createElement(Bridge, {
                node: rootNode,
                createPortal,
              })
            );
          };
          window.ms_globals.sharedRoot = rootNode;
        }
        let parent = init.parent;
        if (!parent) {
          parent = window.ms_globals.sharedRoot!;
        }
        const node: TreeNode = Object.assign(init, {
          key,
          autoKey: 0,
          ignore: sveltifyOptions.ignore,
          reactComponent,
          nodes: [],
          rerender: parent.rerender,
        });
        parent.nodes.push(node);
        parent.rerender?.();
        return node;
      },
    };

    (ReactWrapper as any)(internals, wrapperProps);
  }

  return new Promise((resolve) => {
    if (!window.ms_globals.initializePromise) {
      window.ms_globals.initializePromise = new Promise((r) => {
        window.ms_globals.initialize = () => {
          r();
        };
      });
    }
    window.ms_globals.initializePromise.then(() => {
      resolve(Sveltified as any);
    });
  });
}
