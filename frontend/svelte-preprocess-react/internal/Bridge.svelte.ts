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
import { useMemoizedEqualValue } from '@utils/hooks/useMemoizedEqualValue';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { patchProps } from '@utils/patchProps';

import { BridgeContext } from './BridgeContext';
import Child from './Child';
import type { TreeNode } from './types';

// omit attached_events
function omitNodeProps(props: Record<string, any>) {
  const excludes = ['attachedEvents', '$$slots', 'ms_auto_loading'];
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

const watch = (_value: any) => {};

const Bridge: React.FC<BridgeProps> = ({ node, createPortal }) => {
  const fresh = useRef(false);
  const [, rerender] = useState({});
  useEffect(
    () =>
      $effect.root(() => {
        $effect(() => {
          watch(node.props);
          if (!fresh.current) {
            fresh.current = true;
            return;
          }
          rerender({});
        });
      }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
    return $state.snapshot(patchProps(omitNodeProps(originalNodeProps)));
  }, [originalNodeProps]);

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
  const memoizedProps = useMemoizedEqualValue(props);

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
      ...node.nodes.map((subnode) => {
        return createElement(Bridge, {
          key: `bridge${subnode.key}`,
          createPortal,
          node: subnode,
          // slotKey
          nodeSlotKey: subnode.slotKey,
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
    // eslint-disable-next-line react-hooks/immutability
    portalTarget._effects = portalTarget._effects || [];
    // eslint-disable-next-line react-hooks/immutability
    portalTarget._registerEffect = (cb) => {
      portalTarget._effects.push(cb);
      return () => {
        portalTarget._effects = portalTarget._effects.filter((e) => e !== cb);
      };
    };
  }

  useEffect(() => {
    if (portalTarget) {
      portalTarget._effects.forEach((cb) => {
        cb(memoizedProps);
      });
    }
  }, [portalTarget, memoizedProps]);

  if (portalTarget) {
    return createPortal(element, portalTarget);
  }

  return null;
}
export default Bridge;
