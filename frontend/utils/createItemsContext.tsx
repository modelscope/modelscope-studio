import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

export type Item<T extends string = 'children'> =
  | ({
      props: Record<PropertyKey, any>;
      slots: Record<
        string,
        | HTMLElement
        | {
            el?: HTMLElement;
            // slot key, render args
            callback?: (key: string, params: any[]) => void;
            clone?: boolean;
            forceClone?: boolean;
          }
      >;
      el?: HTMLElement;
    } & {
      [K in T]?: Item[];
    })
  | undefined;

export function createItemsContext(key: string) {
  const itemKey = `$$ms-gr-${key}-context-key`;
  function getItems<T extends ('default' | (string & {}))[], V = Item>(
    allowedSlots: T = ['default'] as T
  ): {
    [key in T[number]]: Writable<V[]>;
  } {
    const itemsMap = allowedSlots.reduce(
      (acc, slotKey) => {
        acc[slotKey as T[number]] = writable([] as V[]);
        return acc;
      },
      {} as {
        [key in T[number]]: Writable<V[]>;
      }
    );
    setContext(itemKey, {
      itemsMap,
      allowedSlots,
    });
    return itemsMap;
  }

  function getSetItemFn() {
    const { itemsMap, allowedSlots } = getContext(itemKey) as {
      itemsMap: Record<string, Writable<any[]>>;
      allowedSlots: string[];
    };

    return function <T = Item>(
      slotKey: string | undefined,
      index: number,
      value: T
    ) {
      if (!itemsMap) {
        return;
      }
      if (slotKey) {
        itemsMap[slotKey].update((v) => {
          const newValue = [...v];
          if (allowedSlots.includes(slotKey)) {
            newValue[index] = value;
          } else {
            newValue[index] = undefined;
          }
          return newValue;
        });
      } else {
        if (allowedSlots.includes('default')) {
          itemsMap['default'].update((v) => {
            const newValue = [...v];
            newValue[index] = value;
            return newValue;
          });
        }
      }
    };
  }

  return {
    getItems,
    getSetItemFn,
  };
}
