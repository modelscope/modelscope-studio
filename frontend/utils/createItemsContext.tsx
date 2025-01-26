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
import { applyPatchToProps } from './patchProps';

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
  itemBuiltIn?: any;
  itemProps?: (
    props: Record<string, any>,
    items: { [key in S[number]]: Item[] }
  ) => Record<string, any>;
  slots: Record<
    string,
    | HTMLElement
    | undefined
    | {
        el?: HTMLElement;
        // slot key, render args
        callback?: (key: string, params: any[]) => void;
        clone?: boolean;
        ß?: boolean;
      }
  >;
  children?: React.ReactNode;
  // subItem
  itemChildren?: (items: { [key in S[number]]: Item[] }) => Item[] | undefined;
  itemChildrenKey?: string;
  allowedSlots?: S;
}
export interface ItemsContextProviderProps<
  S extends ('default' | (string & {}))[],
> {
  children?: React.ReactNode;
  allowedSlots?: S;
  onChange?: (items: { [key in S[number]]: Item[] }) => void;
}

export interface CreateItemsContextReturn {
  withItemsContextProvider: <S extends ('default' | (string & {}))[], T>(
    allowedSlots: S,
    Component: React.ComponentType<T>
  ) => React.FC<T>;
  useItems: <S extends ('default' | (string & {}))[]>() => ItemsContextValue<S>;
  ItemHandler: <S extends ('default' | (string & {}))[]>(
    props: ItemHandlerProps<S>
  ) => React.ReactNode;
}

export const createItemsContext = (name: string): CreateItemsContextReturn => {
  if (window.ms_globals && window.ms_globals.itemsContexts[name]) {
    return window.ms_globals.itemsContexts[name];
  }

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
    const itemsRef = useRef(
      allowedSlots.reduce((acc, slotKey) => {
        acc[slotKey] = [];
        return acc;
      }, {}) as ItemsContextValue<S>['items']
    );
    const [items, setItems] = useState<ItemsContextValue<S>['items']>(
      itemsRef.current
    );
    const setItem: ItemsContextValue['setItem'] = useCallback(
      (slotKey, index, value) => {
        if (slotKey) {
          const prev = itemsRef.current;
          if (!allowedSlots.includes(slotKey)) {
            return;
          }
          const newValue = [...prev[slotKey]];
          newValue[index] = value;
          itemsRef.current = {
            ...prev,
            [slotKey]: newValue,
          };
          setItems(itemsRef.current);
        } else {
          if (allowedSlots.includes('default')) {
            const prev = itemsRef.current;
            // console.log(prev, slotKey, allowedSlots);
            const newValue = [...prev['default']];
            newValue[index] = value;
            itemsRef.current = {
              ...prev,
              default: newValue,
            };
            setItems(itemsRef.current);
          }
        }
      },
      [allowedSlots]
    );
    useEffect(() => {
      onChangeMemoized(items);
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
    itemProps,
    itemChildrenKey = 'children',
    slots,
    allowedSlots,
    children,
    itemBuiltIn,
    ...props
  }: ItemHandlerProps<S>) => {
    const itemChildrenMemoized = useMemoizedFn(itemChildren);
    const itemPropsMemoized = useMemoizedFn(itemProps);
    const hasItemProps = !!itemProps;
    const hasItemChildren = !!itemChildren;
    const prevValueRef = useRef<Item>();
    const [subItems, setSubItems] = useState(
      () =>
        (allowedSlots || []).reduce((acc, slotKey) => {
          acc[slotKey] = [];
          return acc;
        }, {}) as ItemsContextValue<S>['items']
    );
    const { setItem } = useItems();
    useEffect(() => {
      const value: Item = itemBuiltIn
        ? itemBuiltIn
        : {
            el: itemElement,
            props: applyPatchToProps(
              hasItemProps ? itemPropsMemoized(props, subItems) : props
            ),
            slots,
            [itemChildrenKey]: hasItemChildren
              ? itemChildrenMemoized(subItems)
              : undefined,
          };
      if (!isEqual(prevValueRef.current, value)) {
        prevValueRef.current = value;
        setItem(itemSlotKey, itemIndex, value);
      }
    }, [
      itemChildrenMemoized,
      itemBuiltIn,
      itemPropsMemoized,
      itemChildrenKey,
      itemElement,
      itemIndex,
      itemSlotKey,
      props,
      setItem,
      subItems,
      slots,
      hasItemProps,
      hasItemChildren,
    ]);

    return (
      <ItemsContextProvider allowedSlots={allowedSlots} onChange={setSubItems}>
        {children || <span />}
      </ItemsContextProvider>
    );
  };

  const exports = {
    withItemsContextProvider,
    useItems,
    ItemHandler,
  };
  if (window.ms_globals) {
    window.ms_globals.itemsContexts[name] = exports;
  }

  return exports;
};
