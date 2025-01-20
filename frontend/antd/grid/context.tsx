import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { noop } from 'lodash-es';

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

export interface ItemsContextValue<T extends string[] = []> {
  items: {
    [key in T[number]]: Item[];
  };
  setItem: (slotKey: string | undefined, index: number, item: Item) => void;
}

const createItemsContext = () => {
  const ItemsContext = createContext<ItemsContextValue>({
    items: {},
    setItem: noop,
  });

  const withItemsContext = <S extends ('default' | (string & {}))[], T>(
    allowedSlots: S,
    Component: React.ComponentType<T>
  ) => {
    const ItemsContextWrapper: React.FC<T> = (props) => {
      const [items, setItems] = useState<ItemsContextValue['items']>(() =>
        allowedSlots.reduce((acc, slotKey) => {
          acc[slotKey] = [];
          return acc;
        }, {})
      );
      const setItem: ItemsContextValue['setItem'] = useCallback(
        (slotKey, index, value) => {
          if (slotKey) {
            setItems((prev) => {
              const newValue = [...prev[slotKey]];
              if (allowedSlots.includes(slotKey)) {
                newValue[index] = value;
              } else {
                newValue[index] = undefined;
              }
              return {
                ...prev,
                [slotKey]: newValue,
              };
            });
          } else {
            if (allowedSlots.includes('default')) {
              setItems((prev) => {
                const newValue = [...prev['default']];
                newValue[index] = value;
                return {
                  ...prev,
                  default: newValue,
                };
              });
            }
          }
        },
        []
      );
      return (
        <ItemsContext.Provider
          value={useMemo(() => {
            return {
              items,
              setItem,
            };
          }, [items, setItem])}
        >
          <Component {...(props as any)} />
        </ItemsContext.Provider>
      );
    };

    return ItemsContextWrapper;
  };

  const useItems = <T extends string[] = ['default']>() => {
    return useContext(ItemsContext) as ItemsContextValue<T>;
  };

  return {
    withItemsContext,
    useItems,
  };
};

export const { withItemsContext, useItems } = createItemsContext();
