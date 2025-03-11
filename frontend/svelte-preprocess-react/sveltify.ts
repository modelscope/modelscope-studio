import type React from 'react';
import { createPortal } from 'react-dom';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SvelteComponent } from 'svelte';
import { type Writable, writable } from 'svelte/store';

import ReactWrapper from './internal/ReactWrapper.svelte';
import type { SvelteInit } from './internal/types';

export type Sveltified<P extends Record<string, any>> = {
  new (args: { target: any; props?: P }): SvelteComponent<P>;
};

const rerender = window.ms_globals.rerender;
const tree = window.ms_globals.tree;

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
  function Sveltified(options: any) {
    const svelteInstance: Writable<any> = writable<any>();
    const instance = new ReactWrapper({
      ...options,
      props: {
        svelteInit(init: SvelteInit) {
          window.ms_globals.autokey += 1;
          const node = {
            key: window.ms_globals.autokey,
            svelteInstance,
            reactComponent,
            props: init.props,
            slot: init.slot,
            target: init.target,
            slotIndex: init.slotIndex,
            subSlotIndex: init.subSlotIndex,
            ignore: sveltifyOptions.ignore,
            slotKey: init.slotKey,
            nodes: [],
          };
          // Here will be two trees on the page, one is the html view and the other is the React context.
          const parent = init.parent ?? tree;
          parent.nodes = [...parent.nodes, node];
          rerender({ createPortal, node: tree });
          init.onDestroy(() => {
            parent.nodes = parent.nodes.filter(
              (n) => n.svelteInstance !== svelteInstance
            );
            rerender({ createPortal, node: tree });
          });
          return node;
        },
        ...options.props,
      },
    });
    svelteInstance.set(instance);

    return instance;
  }

  return new Promise((resolve) => {
    window.ms_globals.initializePromise.then(() => {
      resolve(Sveltified as any);
    });
  });
}
