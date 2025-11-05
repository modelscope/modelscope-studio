import {
  useAutoCompleteContext,
  useFormItemContext,
  useSuggestionContext,
} from '@svelte-preprocess-react/context';
import React, { useMemo } from 'react';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { patchProps } from '@utils/patchProps';
import { writable } from 'svelte/store';

import useStore, { useStores } from '../useStore';

import { BridgeContext } from './BridgeContext';
import Child from './Child';
import type { TreeNode } from './types';

export type BridgeProps = {
  createPortal: (
    children: React.ReactNode,
    container: Element | DocumentFragment,
    key?: null | string
  ) => React.ReactPortal;
  node: TreeNode;
  nodeSlotKey?: string;
};

// omit attached_events
function omitNodeProps(props: Record<string, any>) {
  if (Reflect.has(props, 'attachedEvents')) {
    const newProps = { ...props };
    Reflect.deleteProperty(newProps, 'attachedEvents');
    return newProps;
  }
  return props;
}

const Bridge: React.FC<BridgeProps> = ({ createPortal, node }) => {
  // rerender when target or slot changed
  const target = useStore(node.target);
  const originalNodeProps = useStore(node.props);
  const nodeProps = useMemo(() => {
    return patchProps(omitNodeProps(originalNodeProps));
  }, [originalNodeProps]);
  const slot = useStore(node.slot);
  const subSlotKeys = useStores<string | undefined>(
    useMemo(
      () => node.nodes.map((subnode) => subnode.slotKey || writable()),
      [node.nodes]
    )
  );

  let formItemContext = useFormItemContext();
  const slotKey = useStore(node.slotKey || writable());
  if (slotKey) {
    formItemContext = {};
  }
  const autoCompleteContext = useAutoCompleteContext();
  const suggestionContext = useSuggestionContext();
  let props: typeof nodeProps = useMemo(() => {
    return omitUndefinedProps({
      ...nodeProps,
      // If the component is ignore, then its value should ignore the influence of the context.
      ...(node.ignore ? {} : formItemContext || {}),
      ...(node.ignore ? {} : autoCompleteContext || {}),
      ...(node.ignore ? {} : suggestionContext || {}),
      onKeyDown:
        (!node.ignore &&
          (autoCompleteContext?.onKeyDown ||
            formItemContext?.onKeyDown ||
            suggestionContext?.onKeyDown)) ||
        nodeProps.onKeyDown
          ? (...args: any[]) => {
              if (!node.ignore) {
                autoCompleteContext?.onKeyDown?.(...args);
                formItemContext?.onKeyDown?.(...args);
                suggestionContext?.onKeyDown?.(...args);
              }
              return nodeProps?.onKeyDown?.(...args);
            }
          : nodeProps.onKeyDown,
      onChange:
        (!node.ignore &&
          (autoCompleteContext?.onChange ||
            formItemContext?.onChange ||
            suggestionContext?.onChange)) ||
        nodeProps.onChange
          ? (...args: any[]) => {
              if (!node.ignore) {
                autoCompleteContext?.onChange?.(...args);
                formItemContext?.onChange?.(...args);
                suggestionContext?.onChange?.(...args);
              }
              return nodeProps?.onChange?.(...args);
            }
          : nodeProps.onChange,
    });
  }, [
    nodeProps,
    node.ignore,
    formItemContext,
    autoCompleteContext,
    suggestionContext,
  ]);

  if (!target) {
    return null;
  }

  let children: React.ReactElement[] | undefined;
  if (node.nodes.length === 0 && slot === undefined) {
    if (props.children) {
      children = props.children;
      props = { ...props };
      delete props.children;
    }
  } else {
    children = node.nodes.map((subnode, i) =>
      React.createElement(Bridge, {
        key: `bridge${subnode.key}`,
        createPortal,
        node: subnode,
        // slotKey
        nodeSlotKey: subSlotKeys[i],
      })
    );
    if (props.children) {
      children.push(props.children);
      props = { ...props };
      delete props.children;
    }
    if (slot) {
      children.push(
        React.createElement(Child, {
          key: 'svelte-slot',
          __slot__: true,
          el: slot,
        })
      );
    }
  }

  // render in different container
  // eslint-disable-next-line react/no-children-prop
  const element = React.createElement(BridgeContext, {
    props,
    reactComponent: node.reactComponent,
    children,
  });
  // eslint-disable-next-line react-hooks/immutability
  target._reactElement = element;
  return createPortal(element, target);
};
export default Bridge;
