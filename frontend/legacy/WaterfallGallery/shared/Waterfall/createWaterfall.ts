import type { WaterfallOptions } from './layout';
import { waterfall_layout } from './layout';

export const isElement = (el: Node): el is Element => el.nodeType == 1;

const heightSymbol = Symbol();
const widthSymbol = Symbol();

interface LayoutObserverElement extends HTMLElement {
  [widthSymbol]?: number;
  [heightSymbol]?: number;
}

/**
 * layout observer
 * @example
 * const layout = createLayoutObserver(div, () => console.log('layout changed'))
 * layout.mount()
 */
export function createLayoutObserver(
  el: LayoutObserverElement,
  rerender: () => void
) {
  let sizeObserver: ResizeObserver; // size changes
  let childrenObserver: MutationObserver; // element changes

  let isLayingOut = false;

  function layout() {
    if (isLayingOut) return;
    isLayingOut = true;
    requestAnimationFrame(() => {
      rerender();
      el[widthSymbol] = el.offsetWidth;
      el[heightSymbol] = el.offsetHeight;
      isLayingOut = false;
    });
  }

  function mount() {
    if (!el) return;
    sizeObserver = new ResizeObserver((entries) => {
      if (
        entries.some((entry) => {
          const target = entry.target as LayoutObserverElement;
          return (
            target[widthSymbol] !== target.offsetWidth ||
            target[heightSymbol] !== target.offsetHeight
          );
        })
      ) {
        layout();
      }
    });

    sizeObserver.observe(el);

    Array.from(el.children).forEach((child) => {
      sizeObserver.observe(child);
    });

    childrenObserver = new MutationObserver((entries) => {
      entries.forEach((entry) => {
        entry.addedNodes.forEach(
          (node) => isElement(node) && sizeObserver.observe(node)
        );
        entry.removedNodes.forEach(
          (node) => isElement(node) && sizeObserver.unobserve(node)
        );
      });
      layout();
    });
    childrenObserver.observe(el, { childList: true, attributes: false });

    layout();
  }

  function unmount() {
    sizeObserver?.disconnect();
    childrenObserver?.disconnect();
  }

  return { layout, mount, unmount };
}

/**
 * waterfall layout
 *
 * @example
 * const layout = createWaterfall(div, { cols: 4, gap: 4 })
 * layout.mount()
 */
export const createWaterfall = (el: HTMLElement, options: WaterfallOptions) =>
  createLayoutObserver(el, () => {
    waterfall_layout(
      el as LayoutObserverElement,
      {
        getWidth: (element) => element.offsetWidth,
        setWidth: (element, v) => (element.style.width = v + 'px'),
        getHeight: (element) => (
          (element[widthSymbol] = element.offsetWidth),
          (element[heightSymbol] = element.offsetHeight)
        ),
        setHeight: (element, v) => (element.style.height = v + 'px'),
        getPadding: (element) => {
          const pad = getComputedStyle(element);
          return [
            parseInt(pad.paddingTop),
            parseInt(pad.paddingRight),
            parseInt(pad.paddingBottom),
            parseInt(pad.paddingLeft),
          ];
        },
        setX: (element, v) => (element.style.left = v + 'px'),
        setY: (element, v) => (element.style.top = v + 'px'),
        getChildren: (element) =>
          Array.from(element.children) as LayoutObserverElement[],
      },
      options
    );
  });
