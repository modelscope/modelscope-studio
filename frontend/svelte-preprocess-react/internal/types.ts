import type { ComponentClass, FunctionComponent } from 'react';
import type { Component, Snippet } from 'svelte';

export type HandlerName<T extends string> = `on${Capitalize<T>}`;
export type EventName<T extends string> = T extends `on${infer N}`
  ? Uncapitalize<N>
  : never;

export type SvelteEventHandlers<T> =
  T extends Record<infer Key extends string, infer Value>
    ? Partial<Record<HandlerName<Key>, (e: Value) => void | boolean>>
    : never;

type Uppercase =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

type ReactEventProp = `on${Uppercase}${string}`;
type ExcludeProps<T> = T extends ReactEventProp ? T : never;
type ExcludeEvents<T> = T extends ReactEventProp ? never : T;

export type EventProps<ReactProps> = Omit<
  ReactProps,
  ExcludeEvents<keyof ReactProps>
>;
export type OmitEventProps<ReactProps> = Omit<
  ReactProps,
  ExcludeProps<keyof ReactProps>
>;

export type TreeNode = Omit<SvelteInit, 'onDestroy'> & {
  reactComponent: FunctionComponent<any> | ComponentClass<any>;
  key: number;
  ignore?: boolean;
  nodes: TreeNode[];
};

export type SvelteInit = {
  parent?: TreeNode;
  props: Record<string, any>;
  portalTarget: HTMLElement | undefined;
  svelteChildren: Snippet | undefined;
  childrenSource: HTMLElement | undefined;
  slotKey: string | undefined;
  slotIndex: number | undefined;
  subSlotIndex: number | undefined;
  rerender?: () => void | undefined;
};

export type ChildrenPropsAsSnippet<T> = T extends { children: unknown }
  ? Omit<T, 'children'> & { children: Snippet | T['children'] }
  : T extends { children?: unknown }
    ? Omit<T, 'children'> & { children?: Snippet | T['children'] }
    : T;

export type Sveltified<T extends Record<string, any>> = Component<
  ChildrenPropsAsSnippet<T>
>;
