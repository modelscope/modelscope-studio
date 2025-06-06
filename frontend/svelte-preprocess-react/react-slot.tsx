import { useContextPropsContext } from '@svelte-preprocess-react/context';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { styleObject2HtmlStyle } from '@utils/style';
import { debounce } from 'lodash-es';

export interface ReactSlotProps {
  slot: HTMLElement;
  clone?: boolean;
  style?: React.CSSProperties;
  observeAttributes?: boolean;
  className?: string;
}

function cloneElementWithEvents(element: HTMLElement) {
  const portals: React.ReactPortal[] = [];
  const clonedElement = element.cloneNode(false) as HTMLElement;
  if (element._reactElement) {
    const resolvedChildren: Array<React.ReactNode> & {
      originalChildren: React.ReactNode;
    } = React.Children.toArray(element._reactElement.props.children).map(
      (child) => {
        // get svelte-slot
        if (React.isValidElement(child) && child.props.__slot__) {
          const { portals: childPortals, clonedElement: childClonedElement } =
            cloneElementWithEvents(child.props.el);

          // Child Component
          return React.cloneElement(child, {
            ...child.props,
            el: childClonedElement,
            children: [
              ...React.Children.toArray(child.props.children),
              ...childPortals,
            ],
          });
        }
        return null;
      }
    ) as typeof resolvedChildren;
    resolvedChildren.originalChildren = element._reactElement.props.children;
    portals.push(
      createPortal(
        React.cloneElement(element._reactElement, {
          ...element._reactElement.props,
          children: resolvedChildren,
        }),
        clonedElement
      )
    );
    return {
      clonedElement,
      portals,
    };
  }
  // clone eventListener
  Object.keys(element.getEventListeners()).forEach((eventName) => {
    const listeners = element.getEventListeners(
      eventName as keyof ElementEventMap
    );
    listeners.forEach(({ listener, type, useCapture }) => {
      clonedElement.addEventListener(type, listener, useCapture);
    });
  });
  const elementsChildrenArray = Array.from(element.childNodes);
  for (let i = 0; i < elementsChildrenArray.length; i++) {
    const child = elementsChildrenArray[i];
    // element
    if (child.nodeType === 1) {
      const { clonedElement: clonedChild, portals: portalsChildren } =
        cloneElementWithEvents(child as HTMLElement);
      portals.push(...portalsChildren);
      clonedElement.appendChild(clonedChild);
      // clonedElement.replaceChild(clonedChild, clonedElement.children[i]);
      // text
    } else if (child.nodeType === 3) {
      clonedElement.appendChild(child.cloneNode());
    }
  }

  return {
    clonedElement,
    portals,
  };
}

function mountElRef(elRef: React.ForwardedRef<HTMLElement>, el: HTMLElement) {
  if (elRef) {
    if (typeof elRef === 'function') {
      elRef(el);
    } else {
      elRef.current = el;
    }
  }
}

// eslint-disable-next-line react/display-name
export const ReactSlot = forwardRef<HTMLElement, ReactSlotProps>(
  ({ slot, clone: cloneProp, className, style, observeAttributes }, elRef) => {
    const ref = useRef<HTMLElement>();
    const [children, setChildren] = useState<React.ReactElement[]>([]);
    const { forceClone } = useContextPropsContext();
    const clone = forceClone ? true : cloneProp;
    useEffect(() => {
      if (!ref.current || !slot) {
        return;
      }
      let cloned = slot;

      function mountElementProps() {
        let child = cloned as Element;
        if (
          cloned.tagName.toLowerCase() === 'svelte-slot' &&
          cloned.children.length === 1 &&
          cloned.children[0]
        ) {
          child = cloned.children[0];
          if (
            child.tagName.toLowerCase() === 'react-portal-target' &&
            child.children[0]
          ) {
            child = child.children[0];
          }
        }
        mountElRef(elRef, child as HTMLElement);

        if (className) {
          child.classList.add(...className.split(' '));
        }
        if (style) {
          const htmlStyle = styleObject2HtmlStyle(style);

          Object.keys(htmlStyle).forEach((key) => {
            ((child as HTMLElement).style as any)[key] = htmlStyle[key];
          });
        }
      }
      let observer: MutationObserver | null = null;
      let mountPropsTimer: ReturnType<typeof setTimeout> | null = null;
      if (clone && window.MutationObserver) {
        function render() {
          if (ref.current?.contains(cloned)) {
            ref.current?.removeChild(cloned);
          }

          const { portals, clonedElement } = cloneElementWithEvents(slot);
          cloned = clonedElement;
          setChildren(portals);
          cloned.style.display = 'contents';
          if (mountPropsTimer) {
            clearTimeout(mountPropsTimer);
          }
          mountPropsTimer = setTimeout(() => {
            mountElementProps();
          }, 50);

          ref.current?.appendChild(cloned);
        }
        render();
        const handleObserve = debounce(() => {
          render();
          observer?.disconnect();

          // for custom render like Table render
          observer?.observe(slot, {
            childList: true,
            subtree: true,
            attributes: observeAttributes,
          });
        }, 50);

        observer = new window.MutationObserver(handleObserve);
        observer.observe(slot, {
          attributes: true,
          childList: true,
          subtree: true,
        });
      } else {
        cloned.style.display = 'contents';
        mountElementProps();
        ref.current?.appendChild(cloned);
      }

      return () => {
        cloned.style.display = '';
        if (ref.current?.contains(cloned)) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          ref.current?.removeChild(cloned);
        }
        observer?.disconnect();
      };
    }, [slot, clone, className, style, elRef, observeAttributes, forceClone]);

    return React.createElement(
      'react-child',
      {
        ref,
        style: { display: 'contents' },
      },
      ...children
    );
  }
);
