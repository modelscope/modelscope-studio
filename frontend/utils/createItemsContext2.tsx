import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isEqual, noop } from 'lodash-es';

import { useMemoizedEqualValue } from './hooks/useMemoizedEqualValue';
import { useMemoizedFn } from './hooks/useMemoizedFn';

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

export interface ItemsContextValue<
  T extends ('default' | (string & {}))[] = string[],
> {
  items: {
    [key in T[number]]: Item[];
  };
  setItem: (slotKey: string | undefined, index: number, item: Item) => void;
  initial: boolean;
}

export interface ItemHandlerProps<
  S extends ('default' | (string & {}))[] = [],
> {
  itemIndex: number;
  itemSlotKey?: string;
  itemElement?: HTMLElement;
  slots: Record<string, HTMLElement>;
  children?: React.ReactNode;
  // subItem
  itemChildren?: (items: { [key in S[number]]: Item[] }) => Item[] | undefined;
  allowedSlots?: S;
}
export interface ItemsContextProviderProps<
  S extends ('default' | (string & {}))[],
> {
  children?: React.ReactNode;
  allowedSlots?: S;
  onChange?: (items: { [key in S[number]]: Item[] }) => void;
}
export const createItemsContext = () => {
  const ItemsContext = createContext<ItemsContextValue>({
    items: {},
    setItem: noop,
    initial: false,
  });
  const ItemsContextProvider = <S extends ('default' | (string & {}))[]>({
    children,
    allowedSlots: allowedSlotsProp = [] as unknown as S,
    onChange,
  }: ItemsContextProviderProps<S>) => {
    const allowedSlots = useMemoizedEqualValue(allowedSlotsProp);
    const onChangeMemoized = useMemoizedFn(onChange);
    const [items, setItems] = useState<ItemsContextValue<S>['items']>(
      () =>
        allowedSlots.reduce((acc, slotKey) => {
          acc[slotKey] = [];
          return acc;
        }, {}) as ItemsContextValue<S>['items']
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
      [allowedSlots]
    );
    useEffect(() => {
      onChangeMemoized?.(items);
    }, [onChangeMemoized, items]);
    return (
      <ItemsContext.Provider
        value={useMemo(() => {
          return {
            items,
            setItem,
            initial: true,
          };
        }, [items, setItem])}
      >
        {children}
      </ItemsContext.Provider>
    );
  };
  const withItemsContextProvider = <S extends ('default' | (string & {}))[], T>(
    allowedSlots: S,
    Component: React.ComponentType<T>
  ) => {
    const ItemsContextWrapper: React.FC<T> = (props) => {
      return (
        <ItemsContextProvider allowedSlots={allowedSlots}>
          <Component {...(props as any)} />
        </ItemsContextProvider>
      );
    };

    return ItemsContextWrapper;
  };

  const useItems = <S extends ('default' | (string & {}))[]>() => {
    return useContext(ItemsContext) as ItemsContextValue<S>;
  };

  const ItemHandler = <S extends ('default' | (string & {}))[]>({
    itemIndex,
    itemSlotKey,
    itemElement,
    itemChildren,
    slots,
    allowedSlots,
    children,
    ...props
  }: ItemHandlerProps<S>) => {
    const prevValueRef = useRef<Item>();
    const [subItems, setSubItems] = useState<ItemsContextValue<S>['items']>(
      () =>
        (allowedSlots || []).reduce((acc, slotKey) => {
          acc[slotKey] = [];
          return acc;
        }, {}) as ItemsContextValue<S>['items']
    );
    const { setItem } = useItems();
    useEffect(() => {
      const value: Item = {
        el: itemElement,
        props,
        slots,
        children: itemChildren ? itemChildren(subItems) : undefined,
      };

      if (!isEqual(prevValueRef.current, value)) {
        prevValueRef.current = value;
        setItem(itemSlotKey, itemIndex, value);
      }
    }, [
      itemChildren,
      itemElement,
      itemIndex,
      itemSlotKey,
      props,
      setItem,
      slots,
      subItems,
    ]);
    return (
      <ItemsContextProvider allowedSlots={allowedSlots} onChange={setSubItems}>
        {children || <span />}
      </ItemsContextProvider>
    );
  };

  return {
    withItemsContextProvider,
    useItems,
    ItemHandler,
  };
};
