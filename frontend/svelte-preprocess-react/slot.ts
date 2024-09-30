import { getContext, setContext } from 'svelte';
import { get, type Writable, writable } from 'svelte/store';

import { getComponentRestProps } from './component';

const slotsKey = '$$ms-gr-slots-key';

export function getSlots() {
  const slots = writable({} as Record<string, HTMLElement>);

  return setContext(slotsKey, slots);
}

export function getSetSlotFn() {
  const slots =
    (getContext(slotsKey) as Writable<Record<string, HTMLElement>>) ||
    writable({});

  return (prevSlot: string, slot: string, el: HTMLElement) => {
    slots.update((v) => {
      const newValue = { ...v };
      if (prevSlot) {
        Reflect.deleteProperty(newValue, prevSlot);
      }
      return { ...newValue, [slot]: el };
    });
  };
}

const slotParamsKey = '$$ms-gr-render-slot-context-key';

export type SetSlotParams = (
  key: string,
  params: any[] | ((prevValue: any[]) => any[])
) => void;

export function getSetSlotParamsFn(): SetSlotParams {
  const slotParams = setContext(
    slotParamsKey,
    writable<Record<string, any[]>>({})
  );
  return (key, params) => {
    slotParams.update((v) => {
      if (typeof params === 'function') {
        return {
          ...v,
          [key]: params(v[key]),
        };
      }
      return {
        ...v,
        [key]: params,
      };
    });
  };
}
export function getSlotParams() {
  return getContext(slotParamsKey) as
    | Writable<Record<string, any[]>>
    | undefined;
}

const slotContextKey = '$$ms-gr-context-key';
export function getSetSlotContextFn() {
  const value = writable();
  setContext(slotContextKey, value);
  return (v: any) => {
    value.set(v);
  };
}

/**
 *
 * will run `resetSlotKey` inside
 */
export function getSlotContext<
  T extends {
    as_item?: string;
    _internal: Record<string, any>;
    restProps?: Record<string, any>;
  },
>(
  props: T,
  restPropsMapping?: Record<keyof T['restProps'], string>,
  options?: {
    shouldRestSlotKey?: boolean;
  }
): [
  Writable<
    T & {
      originalRestProps?: Record<string, any>;
    }
  >,
  (props: T) => void,
] {
  const shouldRestSlotKey = options?.shouldRestSlotKey ?? true;
  if (!Reflect.has(props, 'as_item') || !Reflect.has(props, '_internal')) {
    throw new Error('`as_item` and `_internal` is required');
  }
  const slotKey = getSlotKey();
  const componentSlotContext = setComponentSlotContext({
    slot: undefined,
    index: props._internal.index,
    subIndex: props._internal.subIndex,
  });
  if (slotKey) {
    slotKey.subscribe((v) => {
      componentSlotContext.slotKey.set(v as string);
    });
  }
  // reset slot key to make sure the sub component does not be affected by gr.Slot()
  if (shouldRestSlotKey) {
    resetSlotKey();
  }
  const ctx = getContext(slotContextKey) as Writable<T>;
  const as_item = get(ctx)?.as_item || props.as_item;
  const initialCtxValue: Record<string, any> = ctx
    ? as_item
      ? (get(ctx)[as_item as keyof T] as Record<string, any>)
      : get(ctx)
    : {};
  const mergeRestProps = (
    restProps?: Record<string, any>,
    ctxValue?: Record<string, any>
  ) => {
    return restProps
      ? getComponentRestProps(
          {
            ...restProps,
            ...(ctxValue || {}),
          },
          restPropsMapping
        )
      : undefined;
  };
  const mergedProps = writable<T>({
    ...props,
    ...initialCtxValue,
    restProps: mergeRestProps(props.restProps, initialCtxValue),
    originalRestProps: props.restProps,
  });
  if (!ctx) {
    return [
      mergedProps,
      (v) => {
        mergedProps.set({
          ...v,
          restProps: mergeRestProps(v.restProps),
          originalRestProps: v.restProps,
        });
      },
    ];
  }
  ctx.subscribe((ctxValue) => {
    const { as_item: merged_as_item } = get(mergedProps);
    if (merged_as_item) {
      ctxValue = (ctxValue as Record<string, any>)[merged_as_item];
    }
    mergedProps.update((prev) => ({
      ...prev,
      ...ctxValue,
      restProps: mergeRestProps(prev.restProps, ctxValue),
    }));
  });

  return [
    mergedProps,
    (v) => {
      const ctxValue: Record<string, any> = v.as_item
        ? (get(ctx)[v.as_item as keyof T] as Record<string, any>)
        : get(ctx);
      return mergedProps.set({
        ...v,
        ...ctxValue,
        restProps: mergeRestProps(v.restProps, ctxValue),
        originalRestProps: v.restProps,
      });
    },
  ];
}

const slotKey = '$$ms-gr-slot-key';

export function resetSlotKey() {
  setContext(slotKey, writable(undefined));
}
export function setSlotKey(slot: string) {
  return setContext(slotKey, writable(slot));
}
export function getSlotKey() {
  return getContext(slotKey) as Writable<string | undefined> | undefined;
}

const componentSlotContextKey = '$$ms-gr-component-slot-context-key';

export function setComponentSlotContext({
  slot,
  index,
  subIndex,
}: {
  slot: string | undefined;
  index: number | undefined;
  subIndex: number | undefined;
}) {
  return setContext(componentSlotContextKey, {
    slotKey: writable(slot),
    slotIndex: writable(index),
    subSlotIndex: writable(subIndex),
  });
}
export function getComponentSlotContext() {
  return getContext(componentSlotContextKey) as
    | {
        slotKey: Writable<string | undefined>;
        slotIndex: Writable<number | undefined>;
        subSlotIndex: Writable<number | undefined>;
      }
    | undefined;
}
