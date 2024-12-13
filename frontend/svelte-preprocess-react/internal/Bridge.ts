import React, { useMemo } from 'react';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { writable } from 'svelte/store';

import { useAutoCompleteContext, useFormItemContext } from '../context';
import useStore, { useStores } from '../useStore';

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
  let nodeProps = useStore(node.props);
  nodeProps = omitNodeProps(nodeProps);
  const slot = useStore(node.slot);
  const subSlotKeys = useStores<string | undefined>(
    useMemo(
      () => node.nodes.map((subnode) => subnode.slotKey || writable()),
      [node.nodes]
    )
  );
  const formItemContext = useFormItemContext();

  const autoCompleteContext = useAutoCompleteContext();
  let props: typeof nodeProps = useMemo(() => {
    return {
      ...omitUndefinedProps(nodeProps),
      ...(formItemContext || {}),
      ...autoCompleteContext,
      onChange:
        autoCompleteContext?.onChange ||
        formItemContext?.onChange ||
        nodeProps.onChange
          ? (...args: any[]) => {
              autoCompleteContext?.onChange?.(...args);
              formItemContext?.onChange?.(...args);
              return nodeProps?.onChange?.(...args);
            }
          : nodeProps.onChange,
    };
  }, [autoCompleteContext, nodeProps, formItemContext]);

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
  const element =
    children === undefined
      ? React.createElement(node.reactComponent, props)
      : React.createElement(node.reactComponent, props, ...children);
  target._reactElement = element;

  return createPortal(element, target);
};
export default Bridge;
