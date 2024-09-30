import React, { forwardRef, useEffect, useRef } from 'react';
import { styleObject2HtmlStyle } from '@utils/styleObject2String';

export interface ReactSlotProps {
  slot: HTMLElement;
  clone?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

function cloneElementWithEvents(element: HTMLElement) {
  const clonedElement = element.cloneNode(true) as HTMLElement;
  // clone eventListener
  Object.keys(element.getEventListeners()).forEach((eventName) => {
    const listeners = element.getEventListeners(
      eventName as keyof ElementEventMap
    );
    listeners.forEach(({ listener, type, useCapture }) => {
      clonedElement.addEventListener(type, listener, useCapture);
    });
  });
  const elementsChildrenArray = Array.from(element.children);
  for (let i = 0; i < elementsChildrenArray.length; i++) {
    const child = elementsChildrenArray[i];

    const clonedChild = cloneElementWithEvents(child as HTMLElement);
    clonedElement.replaceChild(clonedChild, clonedElement.children[i]);
  }

  return clonedElement;
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
  ({ slot, clone, className, style }, elRef) => {
    const ref = useRef<HTMLElement>();
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
      if (clone && window.MutationObserver) {
        function render() {
          cloned = cloneElementWithEvents(slot);
          cloned.style.display = 'contents';
          mountElementProps();
          ref.current?.appendChild(cloned);
        }
        render();
        observer = new window.MutationObserver(() => {
          if (ref.current?.contains(cloned)) {
            ref.current?.removeChild(cloned);
          }
          render();
        });
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
    }, [slot, clone, className, style, elRef]);
    return React.createElement('react-child', {
      ref,
      style: { display: 'contents' },
    });
  }
);
