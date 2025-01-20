import { ContextPropsProvider } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';

import { type Item } from './createItemsContext';

export function renderItems<R>(
  items: Item[],
  options?: {
    children?: string;
    fallback?: (item: any) => R;
    clone?: boolean;
    forceClone?: boolean;
  },
  key?: React.Key
): undefined | R[] {
  const filterItems = items.filter(Boolean);
  if (filterItems.length === 0) {
    return undefined;
  }
  return filterItems.map((item, i) => {
    if (typeof item !== 'object') {
      if (options?.fallback) {
        return options.fallback(item);
      }
      return item;
    }
    const result = {
      ...item.props,
      key: item.props?.key ?? (key ? `${key}-${i}` : `${i}`),
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
      let clone = options?.clone ?? false;
      let forceClone = options?.forceClone ?? true;
      if (elOrObject instanceof Element) {
        el = elOrObject;
      } else {
        el = elOrObject.el;
        callback = elOrObject.callback;
        clone = elOrObject.clone ?? clone;
        forceClone = elOrObject.forceClone ?? forceClone;
      }

      current[splits[splits.length - 1]] = el ? (
        callback ? (
          (...args: any[]) => {
            callback(splits[splits.length - 1], args);

            return (
              <ContextPropsProvider params={args} forceClone={forceClone}>
                <ReactSlot slot={el} clone={clone} />
              </ContextPropsProvider>
            );
          }
        ) : (
          <ReactSlot slot={el} clone={clone} />
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
        options,
        `${i}`
      );
    }
    return result as R;
  }) as R[];
}
