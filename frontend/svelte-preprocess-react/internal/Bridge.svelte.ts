import {
  useAutoCompleteContext,
  useFormItemContext,
  useSuggestionContext,
} from '@svelte-preprocess-react/react-contexts';
import React, {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createFunction } from '@utils/createFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { patchProps } from '@utils/patchProps';

import { BridgeContext } from './BridgeContext';
import Child from './Child';
import type { TreeNode } from './types';

// omit attached_events
function omitNodeProps(props: Record<string, any>) {
  const excludes = ['attachedEvents', '$$slots'];
  const newProps = { ...props };
  for (const exclude of excludes) {
    if (Reflect.has(newProps, exclude)) {
      Reflect.deleteProperty(newProps, exclude);
    }
  }
  return newProps;
}

export type BridgeProps = {
  node: TreeNode;
  // for hooks: useTarget, useSlotsChildren
  nodeSlotKey?: string;
  createPortal: (
    children: React.ReactNode,
    container: Element | DocumentFragment,
    key?: null | string
  ) => React.ReactPortal;
};

const Bridge: React.FC<BridgeProps> = ({ node, createPortal }) => {
  const fresh = useRef(false);
  const [result, setResult] = useState<React.ReactNode>(() => {
    return React.createElement(BridgeInternal, {
      node,
      createPortal,
    });
  });
  useEffect(
    () =>
      $effect.root(() => {
        $effect(() => {
          fresh.current = true;

          setResult(
            React.createElement(BridgeInternal, {
              // read the object when the property of node changes
              node: $state.snapshot(node) as TreeNode,
              createPortal,
            })
          );
        });
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (fresh.current) {
    fresh.current = false;
    return result;
  }
  return React.createElement(BridgeInternal, {
    node,
    createPortal,
  });
};

function BridgeInternal({
  node,
  createPortal,
}: {
  node: TreeNode;
  createPortal: BridgeProps['createPortal'];
}) {
  let children: React.ReactNode[] = [];

  const {
    portalTarget,
    svelteChildren,
    childrenSource,
    props: originalNodeProps,
  } = node;
  const nodeProps = useMemo(() => {
    return patchProps(omitNodeProps(originalNodeProps));
  }, [originalNodeProps]);

  const subSlotKeys = useMemo(
    () => node.nodes.map((subnode) => subnode.slotKey),
    [node.nodes]
  );
  let formItemContext = useFormItemContext();
  const slotKey = node.slotKey;
  if (slotKey) {
    formItemContext = {};
  }

  const autoCompleteContext = useAutoCompleteContext();
  const suggestionContext = useSuggestionContext();
  const props: typeof nodeProps = useMemo(() => {
    const styles = createFunction(nodeProps.styles, true) || nodeProps.styles;
    const classNames =
      createFunction(nodeProps.classNames, true) || nodeProps.classNames;

    return omitUndefinedProps({
      ...nodeProps,
      ...(styles ? { styles } : {}),
      ...(classNames ? { classNames } : {}),
      // convert styles & classNames
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

  if (svelteChildren) {
    // console.log(childrenSource);
    children = [
      createElement(Child, {
        el: childrenSource,
        __slot__: true,
        key: 'svelte$Children',
      }),
    ];
  }
  if (node.nodes.length !== 0) {
    children = [
      children,
      ...node.nodes.map((subnode, i) => {
        return createElement(Bridge, {
          key: `bridge${subnode.key}`,
          createPortal,
          node: subnode,
          // slotKey
          nodeSlotKey: subSlotKeys[i],
        });
      }),
    ];
  }

  // eslint-disable-next-line react/no-children-prop
  const element = createElement(BridgeContext, {
    props,
    reactComponent: node.reactComponent,
    children,
  });

  if (portalTarget) {
    // eslint-disable-next-line react-hooks/immutability
    portalTarget._reactElement = element;
    return createPortal(element, portalTarget);
  }
  return null;
}
export default Bridge;
