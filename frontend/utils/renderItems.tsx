import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';

import { type Item } from './createItemsContext';

export function renderItems<R>(
  items: Item[],
  options?: {
    children?: string;
    fallback?: (item: any) => R;
    clone?: boolean;
  }
): R[] {
  return items.filter(Boolean).map((item) => {
    if (typeof item !== 'object') {
      if (options?.fallback) {
        return options.fallback(item);
      }
      return item;
    }
    const result = {
      ...item.props,
    };
    let current = result;
    Object.keys(item.slots).forEach((slotKey) => {
      if (
        !item.slots[slotKey] ||
        (!(item.slots[slotKey] instanceof Element) && !item.slots[slotKey].el)
      ) {
        return;
      }

      const splits = slotKey.split('.');
      splits.forEach((split, index) => {
        if (!current[split]) {
          current[split] = {};
        }
        if (index !== splits.length - 1) {
          current = result[split];
        }
      });
      const elOrObject = item.slots[slotKey];

      let el: HTMLElement | undefined;
      let callback: ((key: string, params: any[]) => void) | undefined;
      let clone = false;
      if (elOrObject instanceof Element) {
        el = elOrObject;
      } else {
        el = elOrObject.el;
        callback = elOrObject.callback;
        clone = elOrObject.clone || false;
      }

      current[splits[splits.length - 1]] = el ? (
        callback ? (
          (...args: any[]) => {
            callback(splits[splits.length - 1], args);
            return <ReactSlot slot={el} clone={clone || options?.clone} />;
          }
        ) : (
          <ReactSlot slot={el} clone={clone || options?.clone} />
        )
      ) : (
        current[splits[splits.length - 1]]
      );

      current = result;
    });
    const childrenKey = options?.children || 'children';
    if (item[childrenKey as keyof typeof item]) {
      result[childrenKey] = renderItems(
        item[childrenKey as keyof typeof item] as Item[],
        options
      );
    }
    return result as R;
  }) as R[];
}
